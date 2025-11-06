// Lab 4: Code-First ORM Models (TypeScript)
export class Plan {
  id!: string;
  name!: string;
  max_files!: number;
  max_charts!: number;
  max_dashboards!: number;
  price!: number;
  created_at!: Date;
}

export class User {
  id!: string;
  email!: string;
  full_name?: string;
  plan_id?: string;
  created_at!: Date;
  updated_at!: Date;
}

export class File {
  id!: string;
  user_id!: string;
  file_name!: string;
  file_path!: string;
  file_size!: number;
  file_type!: string;
  uploaded_at!: Date;
}

export class Dashboard {
  id!: string;
  user_id!: string;
  name!: string;
  description?: string;
  created_at!: Date;
  updated_at!: Date;
}

export class Chart {
  id!: string;
  dashboard_id!: string;
  file_id!: string;
  chart_type!: string;
  chart_config!: any;
  title!: string;
  created_at!: Date;
}

export class UsageLog {
  id!: string;
  user_id!: string;
  action!: string;
  details?: any;
  created_at!: Date;
}
