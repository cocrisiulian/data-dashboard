"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { parse } from "csv-parse/sync"

export async function uploadFile(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }
  if (!user.id || typeof user.id !== "string" || !/^[0-9a-fA-F-]{36}$/.test(user.id)) {
    console.error("[uploadFile] Invalid user.id:", user.id)
    throw new Error("User ID is missing or not a valid UUID")
  }

  const file = formData.get("file") as File
  if (!file) {
    throw new Error("No file provided")
  }
  console.log("[uploadFile] user.id:", user.id, "file:", file.name)

  // Check user's plan limits
  const { data: userData } = await supabase.from("users").select("*, plan:plans(*)").eq("id", user.id).single()

  const { count: fileCount } = await supabase
    .from("files")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const maxFiles = userData?.plan?.max_files || 2

  if (maxFiles !== -1 && fileCount !== null && fileCount >= maxFiles) {
    throw new Error(`You have reached your plan limit of ${maxFiles} files. Please upgrade your plan.`)
  }

  // Upload to Supabase Storage
  const fileName = `${user.id}/${Date.now()}-${file.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage.from("files").upload(fileName, file)

  if (uploadError) {
    throw new Error(`Failed to upload file: ${uploadError.message}`)
  }

  // Save file metadata to database
  const { data: fileData, error: fileError } = await supabase
    .from("files")
    .insert({
      user_id: user.id,
      file_name: file.name,
      file_path: uploadData.path,
      file_size: file.size,
      file_type: file.type,
    })
    .select()
    .single()
  if (fileError) {
    console.error("[uploadFile] Insert error:", fileError)
  }

  if (fileError) {
    throw new Error(`Failed to save file metadata: ${fileError.message}`)
  }

  // Log the action
  await supabase.from("usage_logs").insert({
    user_id: user.id,
    action: "file_upload",
    details: { file_id: fileData.id, file_name: file.name },
  })

  revalidatePath("/files")
  return fileData
}

export async function getFiles() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("user_id", user.id)
    .order("uploaded_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch files: ${error.message}`)
  }

  return data
}

export async function deleteFile(fileId: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get file info
  const { data: file } = await supabase.from("files").select("*").eq("id", fileId).eq("user_id", user.id).single()

  if (!file) {
    throw new Error("File not found")
  }

  // Delete from storage
  await supabase.storage.from("files").remove([file.file_path])

  // Delete from database
  const { error } = await supabase.from("files").delete().eq("id", fileId).eq("user_id", user.id)

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`)
  }

  // Log the action
  await supabase.from("usage_logs").insert({
    user_id: user.id,
    action: "file_delete",
    details: { file_id: fileId, file_name: file.file_name },
  })

  revalidatePath("/files")
}

export async function getFileUrl(filePath: string) {
  const supabase = await getSupabaseServerClient()

  const { data } = supabase.storage.from("files").getPublicUrl(filePath)

  return data.publicUrl
}

export async function getFilePreview(fileId: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get file info
  const { data: file, error: fileError } = await supabase
    .from("files")
    .select("*")
    .eq("id", fileId)
    .eq("user_id", user.id)
    .single()

  if (fileError || !file) {
    throw new Error("File not found")
  }

  // Download file from storage
  const { data: fileData, error: downloadError } = await supabase.storage.from("files").download(file.file_path)

  if (downloadError || !fileData) {
    throw new Error(`Failed to download file: ${downloadError?.message}`)
  }

  // Parse CSV using csv-parse
  const text = await fileData.text()
  const records = parse(text, {
    columns: true,
    skip_empty_lines: true,
  })

  const headers = records.length > 0 ? Object.keys(records[0] as Record<string, any>) : []
  const rows = records.slice(0, 20)

  return {
    file,
    headers,
    rows,
    totalRows: records.length,
  }
}
