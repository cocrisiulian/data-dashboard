# DataInsight Dashboard - Architecture Diagram

```plantuml
@startuml DataInsight Architecture

!define RECTANGLE class

skinparam componentStyle rectangle
skinparam backgroundColor #FEFEFE
skinparam component {
  BackgroundColor<<frontend>> #E3F2FD
  BackgroundColor<<api>> #FFF3E0
  BackgroundColor<<controller>> #F3E5F5
  BackgroundColor<<service>> #E8F5E9
  BackgroundColor<<database>> #FCE4EC
  BorderColor #424242
  FontSize 12
}

' Frontend Layer
package "Frontend Layer" <<frontend>> {
  [Next.js 15 App] as Frontend
  [React Components] as Components
  [AuthContext] as AuthContext
  [Dashboard UI] as DashboardUI
  [Admin Panel UI] as AdminUI
  
  Frontend --> Components
  Frontend --> AuthContext
  Components --> DashboardUI
  Components --> AdminUI
}

' API Gateway Layer
package "API Gateway\n(Express.js)" <<api>> {
  [Server.js] as Server
  [Auth Middleware] as AuthMiddleware
  [Admin Middleware] as AdminMiddleware
  [Error Handler] as ErrorHandler
  
  Server --> AuthMiddleware
  Server --> AdminMiddleware
  Server --> ErrorHandler
}

' Controller Layer
package "Controller Layer" <<controller>> {
  [Auth Controller] as AuthCtrl
  [File Controller] as FileCtrl
  [Dashboard Controller] as DashboardCtrl
  [Chart Controller] as ChartCtrl
  [Plan Controller] as PlanCtrl
  [Admin Controller] as AdminCtrl
}

' Service Layer
package "Service Layer" <<service>> {
  [Plan Service] as PlanService
  [Business Logic] as BusinessLogic
  
  PlanService --> BusinessLogic
}

' Database Layer
package "Database Layer" <<database>> {
  database "PostgreSQL" as DB {
    [User Table] as UserTable
    [Plan Table] as PlanTable
    [File Table] as FileTable
    [Dashboard Table] as DashboardTable
    [Chart Table] as ChartTable
    [ActivityLog Table] as ActivityLogTable
  }
  [Prisma ORM] as Prisma
  
  Prisma --> UserTable
  Prisma --> PlanTable
  Prisma --> FileTable
  Prisma --> DashboardTable
  Prisma --> ChartTable
  Prisma --> ActivityLogTable
}

' Flow Connections
Frontend -down-> Server : "HTTP/REST API\n(JWT Token)"
Server -down-> AuthCtrl : "/api/auth/*"
Server -down-> FileCtrl : "/api/files/*"
Server -down-> DashboardCtrl : "/api/dashboards/*"
Server -down-> ChartCtrl : "/api/charts/*"
Server -down-> PlanCtrl : "/api/plans/*"
Server -down-> AdminCtrl : "/api/admin/*"

AuthCtrl -down-> Prisma : "User CRUD"
FileCtrl -down-> Prisma : "File Operations"
DashboardCtrl -down-> Prisma : "Dashboard CRUD"
ChartCtrl -down-> Prisma : "Chart CRUD"
PlanCtrl -down-> PlanService : "Business Logic"
AdminCtrl -down-> Prisma : "Admin Operations"

PlanService -down-> Prisma : "Plan Operations"

' Notes
note right of Frontend
  <b>Technologies:</b>
  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS
  - Shadcn UI
end note

note right of Server
  <b>API Features:</b>
  - JWT Authentication
  - Admin Authorization
  - Swagger Docs
  - Error Handling
  - CORS Support
end note

note right of PlanService
  <b>Business Rules:</b>
  - Plan limits
  - isPopular logic
  - Validation
  - CSV detection
end note

note right of Prisma
  <b>ORM Features:</b>
  - Code First
  - Migrations
  - Relations 1:N, M:N
  - Soft Delete
end note

@enduml
```

## Alternative: Simplified Architecture Diagram

```plantuml
@startuml Simple Architecture

skinparam backgroundColor #FFFFFF
skinparam defaultTextAlignment center

rectangle "**Frontend**\nNext.js + React" as Frontend #E3F2FD
rectangle "**API Gateway**\nExpress.js" as API #FFF3E0
rectangle "**Controllers**\nREST Endpoints" as Controllers #F3E5F5
rectangle "**Services**\nBusiness Logic" as Services #E8F5E9
database "**PostgreSQL**\nvia Prisma ORM" as DB #FCE4EC

Frontend -down-> API : HTTP/REST\n(JWT Auth)
API -down-> Controllers : Route Handlers
Controllers -down-> Services : Business Logic
Services -down-> DB : CRUD Operations
Controllers -down-> DB : Direct Queries

note right of Frontend
  - User Interface
  - Admin Panel
  - Dashboard Views
  - File Upload
end note

note right of Controllers
  <b>Endpoints:</b>
  /api/auth/*
  /api/files/*
  /api/dashboards/*
  /api/charts/*
  /api/plans/*
  /api/admin/*
end note

note right of DB
  <b>Tables:</b>
  User, Plan, File
  Dashboard, Chart
  ActivityLog
end note

@enduml
```

## Detailed Component Diagram

```plantuml
@startuml Component Diagram

!define COMPONENT_BG_COLOR #FFFFFF

skinparam component {
  BackgroundColor COMPONENT_BG_COLOR
  BorderColor #333333
  FontSize 11
}

package "Client Side" {
  [Web Browser] as Browser
  component "Next.js Frontend" {
    [Pages] as Pages
    [Components] as Comp
    [Contexts] as Ctx
    [API Calls] as APICalls
  }
}

package "Server Side" {
  component "Express Backend" {
    [Routes] as Routes
    [Middleware] as MW
    [Controllers] as Ctrl
  }
  
  component "Business Layer" {
    [PlanService] as PS
    [Validators] as Val
  }
  
  component "Data Access" {
    [Prisma Client] as Prisma
  }
}

package "Database" {
  database "PostgreSQL" as PostgreSQL
}

Browser --> Pages : "User Interaction"
Pages --> Comp : "Renders"
Pages --> Ctx : "State Management"
Comp --> APICalls : "Fetch Data"
APICalls --> Routes : "HTTP Requests\n(JWT Token)"
Routes --> MW : "Auth Check"
MW --> Ctrl : "Authorized"
Ctrl --> PS : "Business Logic"
Ctrl --> Prisma : "Data Operations"
PS --> Prisma : "Service Queries"
Prisma --> PostgreSQL : "SQL Queries"

@enduml
```

## Deployment Architecture

```plantuml
@startuml Deployment Diagram

node "Client Browser" {
  [React App] as React
}

node "Application Server" {
  [Next.js Server] as NextJS
  [Express API] as Express
}

node "Database Server" {
  database "PostgreSQL" as DB
}

React --> NextJS : "HTTPS"
NextJS --> Express : "HTTP/4000"
Express --> DB : "PostgreSQL Protocol"

note right of NextJS
  Port: 3000
  SSR + CSR
end note

note right of Express
  Port: 4000
  REST API
  Swagger UI: /api-docs
end note

note right of DB
  Port: 5432
  Prisma ORM
end note

@enduml
```

## Request Flow Sequence Diagram

```plantuml
@startuml Request Flow

actor User
participant "Frontend\n(Next.js)" as Frontend
participant "API Gateway\n(Express)" as API
participant "Auth\nMiddleware" as Auth
participant "Controller" as Controller
participant "Service" as Service
participant "Prisma ORM" as Prisma
database "PostgreSQL" as DB

User -> Frontend: Click "Create Dashboard"
Frontend -> API: POST /api/dashboards\n(JWT Token)
API -> Auth: Verify Token
Auth -> Auth: Check isAdmin (if needed)
Auth --> API: Authorized ✓
API -> Controller: dashboardController.create()
Controller -> Service: Validate Business Rules
Service --> Controller: Validation OK
Controller -> Prisma: prisma.dashboard.create()
Prisma -> DB: INSERT INTO dashboards
DB --> Prisma: Success
Prisma --> Controller: Dashboard Object
Controller -> Prisma: prisma.activityLog.create()
Prisma -> DB: INSERT INTO activity_logs
DB --> Prisma: Log Created
Prisma --> Controller: Log Object
Controller --> API: 201 Created
API --> Frontend: JSON Response
Frontend --> User: Show Success Message

@enduml
```

## Admin CRUD Architecture

```plantuml
@startuml Admin CRUD

actor Admin
participant "Admin UI" as UI
participant "Admin Routes\n/api/admin/*" as Routes
participant "Admin Middleware" as Middleware
participant "Admin Controller" as Controller
participant "Prisma ORM" as Prisma
database "PostgreSQL" as DB

== User Management ==
Admin -> UI: Navigate to /admin/users
UI -> Routes: GET /api/admin/users
Routes -> Middleware: checkAdmin()
Middleware --> Routes: isAdmin ✓
Routes -> Controller: getAllUsers()
Controller -> Prisma: prisma.user.findMany()
Prisma -> DB: SELECT * FROM users
DB --> Prisma: User List
Prisma --> Controller: Users with Plan Info
Controller --> Routes: 200 OK
Routes --> UI: JSON Response
UI --> Admin: Display User Table

== Create User ==
Admin -> UI: Click "Create User"
UI -> Routes: POST /api/admin/users\n{name, email, password, planId}
Routes -> Middleware: checkAdmin()
Middleware --> Routes: Authorized ✓
Routes -> Controller: createUser()
Controller -> Prisma: prisma.user.create()
Prisma -> DB: INSERT INTO users
DB --> Prisma: New User
Controller -> Prisma: prisma.activityLog.create()
Prisma -> DB: INSERT INTO activity_logs
Controller --> Routes: 201 Created
Routes --> UI: User Object
UI --> Admin: Show Success + Refresh

@enduml
```

## Usage

### Online Tool

1. Accesează https://www.plantuml.com/plantuml/uml/
2. Copiază codul PlantUML de mai sus
3. Lipește în editor
4. Vezi diagrama generată
5. Export ca PNG/SVG

### VS Code

1. Instalează extensia "PlantUML" (jebbs.plantuml)
2. Deschide acest fișier
3. Apasă `Alt+D` pentru preview
4. Export: Right-click → Export Current Diagram

### Documentație

Include diagrama exportată în `DOCUMENTATIE_PPAW.md` la secțiunea ARHITECTURĂ.

---

**Creat:** Ianuarie 2026
**Tool:** PlantUML
**Format:** Markdown + PlantUML DSL
