/**
 * Test Data Fixtures
 * Date mock pentru utilizare în tests
 */

export const mockPlans = {
  free: {
    id: 'plan-free',
    name: 'Free',
    price: 0,
    maxFiles: 5,
    maxCharts: 10,
    maxDashboards: 2,
    isPopular: false,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  pro: {
    id: 'plan-pro',
    name: 'Pro',
    price: 9.99,
    maxFiles: 50,
    maxCharts: 100,
    maxDashboards: 10,
    isPopular: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  enterprise: {
    id: 'plan-enterprise',
    name: 'Enterprise',
    price: 49.99,
    maxFiles: 999,
    maxCharts: 999,
    maxDashboards: 999,
    isPopular: false,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
};

export const mockUsers = {
  john: {
    id: 'user-john',
    email: 'john@example.com',
    username: 'john_doe',
    passwordHash: 'hashed_password',
    planId: 'plan-free',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  jane: {
    id: 'user-jane',
    email: 'jane@example.com',
    username: 'jane_smith',
    passwordHash: 'hashed_password',
    planId: 'plan-pro',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
};

export const mockFiles = {
  salesData: {
    id: 'file-1',
    originalName: 'sales-data.csv',
    filePath: '/uploads/user-john/sales-data.csv',
    fileSize: 1024,
    mimeType: 'text/csv',
    userId: 'user-john',
    uploadedAt: new Date('2025-01-01'),
  },
  marketingData: {
    id: 'file-2',
    originalName: 'marketing-data.csv',
    filePath: '/uploads/user-jane/marketing-data.csv',
    fileSize: 2048,
    mimeType: 'text/csv',
    userId: 'user-jane',
    uploadedAt: new Date('2025-01-01'),
  },
};

export const mockDashboards = {
  sales: {
    id: 'dashboard-1',
    name: 'Sales Dashboard',
    description: 'Monthly sales analytics',
    userId: 'user-john',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  marketing: {
    id: 'dashboard-2',
    name: 'Marketing Dashboard',
    description: 'Campaign performance',
    userId: 'user-jane',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
};

export const mockCharts = {
  barChart: {
    id: 'chart-1',
    title: 'Sales by Month',
    chartType: 'bar',
    configuration: { xAxis: 'month', yAxis: 'sales' },
    dashboardId: 'dashboard-1',
    fileId: 'file-1',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  lineChart: {
    id: 'chart-2',
    title: 'Revenue Trend',
    chartType: 'line',
    configuration: { xAxis: 'month', yAxis: 'revenue' },
    dashboardId: 'dashboard-2',
    fileId: 'file-2',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
};
