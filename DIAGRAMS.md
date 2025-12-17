# Arhitectura MVC - DataInsight Dashboard

Acest fișier conține diagrama vizuală pentru arhitectura MVC a aplicației.

---

## Arhitectura MVC - Component Diagram

Această diagramă arată structura generală a aplicației și cum comunică componentele între ele.

```mermaid
flowchart LR
    subgraph Frontend["Frontend Layer"]
        direction TB
        Pages[Pages<br/>src/app]
        UI[React Components<br/>src/components]
        Pages --> UI
    end
  
    subgraph API["API Routes Layer"]
        direction TB
        APIPlans["/api/plans"]
        APIFiles["/api/files"]
        APICharts["/api/charts"]
        APIDashboards["/api/dashboards"]
    end
  
    subgraph Server["Server Layer - src/server"]
        direction TB
      
        subgraph Controllers["Controllers"]
            direction LR
            PlanCtrl[PlanController]
            FileCtrl[FileController]
            ChartCtrl[ChartController]
            DashCtrl[DashboardController]
        end
      
        subgraph Services["Services"]
            direction LR
            PlanSvc[PlanService]
            FileSvc[FileService]
            ChartSvc[ChartService]
            DashSvc[DashboardService]
        end
      
        subgraph Repos["Repositories"]
            direction LR
            PlanRepo[PlanRepository]
            FileRepo[FileRepository]
            ChartRepo[ChartRepository]
            DashRepo[DashboardRepository]
            UserRepo[UserRepository]
        end
      
        DI[Awilix DI Container]
    end
  
    subgraph Data["Data Layer"]
        direction TB
        Prisma[Prisma ORM]
        DB[(PostgreSQL)]
        Prisma --> DB
    end
  
    %% Main flow
    UI --> API
    API --> Controllers
    Controllers --> Services
    Services --> Repos
    Repos --> Prisma
  
    %% DI Container
    DI -.->|injects| Controllers
  
    style Pages fill:#e1f5ff
    style UI fill:#e1f5ff
    style PlanCtrl fill:#fff4e1
    style FileCtrl fill:#fff4e1
    style ChartCtrl fill:#fff4e1
    style DashCtrl fill:#fff4e1
    style PlanSvc fill:#f0e1ff
    style FileSvc fill:#f0e1ff
    style ChartSvc fill:#f0e1ff
    style DashSvc fill:#f0e1ff
    style PlanRepo fill:#e1ffe1
    style FileRepo fill:#e1ffe1
    style ChartRepo fill:#e1ffe1
    style DashRepo fill:#e1ffe1
    style UserRepo fill:#e1ffe1
    style DI fill:#ffe1e1
    style Prisma fill:#e8e8e8
    style DB fill:#d0d0d0
```

---

## Legendă Culori

- 🔵 **Albastru** - Frontend/UI Layer
- 🟡 **Galben** - Controller Layer (HTTP)
- 🟣 **Violet** - Service Layer (Business Logic)
- 🟢 **Verde** - Repository Layer (Data Access)
- 🔴 **Roșu** - Infrastructure (DI Container)
- ⚪ **Gri** - Database Layer

---

## Flow-ul arhitectural:

```
Frontend (React Components)
    ↓
API Routes (/api/*)
    ↓
Controllers (HTTP Handling)
    ↓
Services (Business Logic)
    ↓
Repositories (Data Access)
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

**Dependency Injection**: Toate componentele sunt gestionate de containerul Awilix care injectează automat dependențele necesare.
