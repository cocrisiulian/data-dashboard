"use client"

import type React from "react"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/controls/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Input } from "@/components/ui/controls/input"
import { Label } from "@/components/ui/text/label"
import { showError, showSuccess } from "@/lib/utils/error-handler"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register } = useAuth()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (password !== repeatPassword) {
      showError({ message: "Parolele nu se potrivesc" }, "Parolele nu se potrivesc. Te rugăm să le introduci din nou.")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      showError({ message: "Password too short" }, "Parola trebuie să aibă cel puțin 6 caractere.")
      setIsLoading(false)
      return
    }

    try {
      await register(email, password, fullName)
      showSuccess("Contul tău a fost creat cu succes! Bun venit!")
      // Redirect directly to dashboard after successful registration
      router.push("/dashboard")
    } catch (error: unknown) {
      // showError will handle user-friendly message and log technical details
      showError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-muted/30">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <CardDescription>Create a new account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="repeat-password">Repeat Password</Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Se creează contul..." : "Înregistrează-te"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Ai deja cont?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Autentifică-te
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
