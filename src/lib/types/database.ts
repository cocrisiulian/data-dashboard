export type Plan = {
  id: string
  name: "Free" | "Pro" | "Custom"
  max_files: number
  max_charts: number
  max_dashboards: number
  price: number
  created_at: string
}

export type User = {
  id: string
  email: string
  full_name: string | null
  plan_id: string | null
  created_at: string
  updated_at: string
}

export type File = {
  id: string
  user_id: string
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  uploaded_at: string
}

export type Dashboard = {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export type ChartType = "bar" | "line" | "pie" | "area" | "scatter"

export type Chart = {
  id: string
  dashboard_id: string
  file_id: string
  chart_type: ChartType
  chart_config: {
    xAxis?: string
    yAxis?: string
    dataKey?: string
    colors?: string[]
    [key: string]: any
  }
  title: string
  created_at: string
}

export type UsageLog = {
  id: string
  user_id: string
  action: string
  details: Record<string, any> | null
  created_at: string
}

export type UserWithPlan = User & {
  plan: Plan | null
}
