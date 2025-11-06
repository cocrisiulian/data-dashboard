# Lab 3: ORM Usage Example

## Create a new user (Prisma-style TypeScript)

```ts
const newUser = await prisma.user.create({
  data: {
    id: 'uuid',
    email: 'user@example.com',
    full_name: 'Test User',
    plan_id: 'plan-uuid',
  },
});
```

## Query dashboards for a user

```ts
const dashboards = await prisma.dashboard.findMany({
  where: { user_id: 'uuid' },
});
```
