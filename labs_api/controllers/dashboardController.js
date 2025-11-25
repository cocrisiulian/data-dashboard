const prisma = require('../config/prisma')

/**
 * GET /api/dashboards
 * Get all dashboards for authenticated user
 */
const getAllDashboards = async (req, res, next) => {
  try {
    const dashboards = await prisma.dashboard.findMany({
      where: { userId: req.user.id },
      include: {
        charts: {
          select: {
            id: true,
            chartType: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(dashboards)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/dashboards/:id
 * Get single dashboard with all charts
 */
const getDashboard = async (req, res, next) => {
  try {
    const { id } = req.params

    const dashboard = await prisma.dashboard.findFirst({
      where: { 
        id,
        userId: req.user.id // Ensure user owns this dashboard
      },
      include: {
        charts: {
          include: {
            file: {
              select: {
                id: true,
                fileName: true,
                fileType: true,
                filePath: true
              }
            }
          }
        }
      }
    })

    if (!dashboard) {
      return res.status(404).json({ 
        error: 'Dashboard not found' 
      })
    }

    // Transform to snake_case for frontend compatibility
    const transformedDashboard = {
      id: dashboard.id,
      user_id: dashboard.userId,
      name: dashboard.name,
      description: dashboard.description,
      created_at: dashboard.createdAt,
      updated_at: dashboard.updatedAt,
      charts: dashboard.charts.map(chart => ({
        id: chart.id,
        dashboard_id: chart.dashboardId,
        file_id: chart.fileId,
        chart_type: chart.chartType,
        chart_config: chart.chartConfig,
        title: chart.title,
        created_at: chart.createdAt,
        file: {
          id: chart.file.id,
          file_name: chart.file.fileName,
          file_type: chart.file.fileType,
          file_path: chart.file.filePath
        }
      }))
    }

    res.json(transformedDashboard)
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/dashboards
 * Create new dashboard
 */
const createDashboard = async (req, res, next) => {
  try {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Dashboard name is required' 
      })
    }

    // Check plan limits
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { 
        plan: true,
        dashboards: { select: { id: true } }
      }
    })

    const currentCount = user.dashboards.length
    const maxAllowed = user.plan?.maxDashboards || 1

    if (maxAllowed !== -1 && currentCount >= maxAllowed) {
      return res.status(403).json({
        error: 'Plan limit reached',
        message: `Your ${user.plan?.name || 'Free'} plan allows only ${maxAllowed} dashboard(s)`,
        current: currentCount,
        max: maxAllowed
      })
    }

    // Create dashboard
    const dashboard = await prisma.dashboard.create({
      data: {
        userId: req.user.id,
        name,
        description
      }
    })

    // Log action
    await prisma.usageLog.create({
      data: {
        userId: req.user.id,
        action: 'dashboard_create',
        details: { dashboardId: dashboard.id, name }
      }
    })

    res.status(201).json(dashboard)
  } catch (error) {
    next(error)
  }
}

/**
 * PATCH /api/dashboards/:id
 * Update dashboard
 */
const updateDashboard = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    // Verify ownership
    const existing = await prisma.dashboard.findFirst({
      where: { id, userId: req.user.id }
    })

    if (!existing) {
      return res.status(404).json({ 
        error: 'Dashboard not found' 
      })
    }

    // Update
    const dashboard = await prisma.dashboard.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description })
      }
    })

    res.json(dashboard)
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/dashboards/:id
 * Delete dashboard (cascades to charts)
 */
const deleteDashboard = async (req, res, next) => {
  try {
    const { id } = req.params

    // Verify ownership
    const existing = await prisma.dashboard.findFirst({
      where: { id, userId: req.user.id }
    })

    if (!existing) {
      return res.status(404).json({ 
        error: 'Dashboard not found' 
      })
    }

    // Delete (cascades to charts via Prisma schema)
    await prisma.dashboard.delete({ where: { id } })

    // Log action
    await prisma.usageLog.create({
      data: {
        userId: req.user.id,
        action: 'dashboard_delete',
        details: { dashboardId: id }
      }
    })

    res.json({ message: 'Dashboard deleted successfully' })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/dashboards/:id/charts
 * Get all charts in a specific dashboard (nested resource)
 */
const getDashboardCharts = async (req, res, next) => {
  try {
    const { id } = req.params

    // Verify dashboard ownership
    const dashboard = await prisma.dashboard.findFirst({
      where: { 
        id,
        userId: req.user.id 
      }
    })

    if (!dashboard) {
      return res.status(404).json({ 
        error: 'Dashboard not found or access denied' 
      })
    }

    // Get all charts for this dashboard
    const charts = await prisma.chart.findMany({
      where: { dashboardId: id },
      include: {
        file: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            filePath: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform to snake_case for frontend
    const transformedCharts = charts.map(chart => ({
      id: chart.id,
      title: chart.title,
      chart_type: chart.chartType,
      chart_config: chart.chartConfig,
      file: {
        id: chart.file.id,
        file_name: chart.file.fileName,
        file_type: chart.file.fileType,
        file_path: chart.file.filePath
      }
    }))

    res.json(transformedCharts)
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/dashboards/:id/charts
 * Create new chart in specific dashboard (nested resource)
 */
const createDashboardChart = async (req, res, next) => {
  try {
    const { id: dashboardId } = req.params
    const { file_id, chart_type, chart_config, title } = req.body

    // Validate required fields
    if (!file_id || !chart_type || !chart_config || !title) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Missing required fields: file_id, chart_type, chart_config, title'
      })
    }

    // Verify dashboard ownership
    const dashboard = await prisma.dashboard.findFirst({
      where: {
        id: dashboardId,
        userId: req.user.id
      },
      include: {
        charts: { select: { id: true } }
      }
    })

    if (!dashboard) {
      return res.status(404).json({ 
        error: 'Dashboard not found or access denied' 
      })
    }

    // Verify file ownership
    const file = await prisma.file.findFirst({
      where: {
        id: file_id,
        userId: req.user.id
      }
    })

    if (!file) {
      return res.status(404).json({ 
        error: 'File not found or access denied' 
      })
    }

    // Check plan limits for charts
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { 
        plan: true,
        charts: { select: { id: true } }
      }
    })

    const currentCount = user.charts.length
    const maxAllowed = user.plan?.maxCharts || 3

    if (maxAllowed !== -1 && currentCount >= maxAllowed) {
      return res.status(403).json({
        error: 'Plan limit reached',
        message: `Your ${user.plan?.name || 'Free'} plan allows only ${maxAllowed} chart(s)`,
        current: currentCount,
        max: maxAllowed
      })
    }

    // Create chart (automatically linked to dashboard via dashboardId)
    const chart = await prisma.chart.create({
      data: {
        dashboardId,
        fileId: file_id,
        chartType: chart_type,
        chartConfig: chart_config,
        title
      },
      include: {
        file: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            filePath: true
          }
        }
      }
    })

    // Log action
    await prisma.usageLog.create({
      data: {
        userId: req.user.id,
        action: 'chart_create_nested',
        details: { 
          chartId: chart.id,
          dashboardId,
          title 
        }
      }
    })

    // Transform to snake_case for frontend
    const transformedChart = {
      id: chart.id,
      title: chart.title,
      chart_type: chart.chartType,
      chart_config: chart.chartConfig,
      file: {
        id: chart.file.id,
        file_name: chart.file.fileName,
        file_type: chart.file.fileType,
        file_path: chart.file.filePath
      }
    }

    res.status(201).json(transformedChart)
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/dashboards/:id/charts/:chartId
 * Delete specific chart from dashboard (nested resource)
 */
const deleteDashboardChart = async (req, res, next) => {
  try {
    const { id: dashboardId, chartId } = req.params

    // Verify dashboard ownership
    const dashboard = await prisma.dashboard.findFirst({
      where: { 
        id: dashboardId,
        userId: req.user.id 
      }
    })

    if (!dashboard) {
      return res.status(404).json({ 
        error: 'Dashboard not found or access denied' 
      })
    }

    // Verify chart exists and belongs to this dashboard
    const chart = await prisma.chart.findFirst({
      where: {
        id: chartId,
        dashboardId
      }
    })

    if (!chart) {
      return res.status(404).json({ 
        error: 'Chart not found in this dashboard' 
      })
    }

    // Delete chart
    await prisma.chart.delete({ where: { id: chartId } })

    // Log action
    await prisma.usageLog.create({
      data: {
        userId: req.user.id,
        action: 'chart_delete_nested',
        details: { 
          chartId,
          dashboardId 
        }
      }
    })

    res.json({ message: 'Chart deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllDashboards,
  getDashboard,
  createDashboard,
  updateDashboard,
  deleteDashboard,
  getDashboardCharts,
  createDashboardChart,
  deleteDashboardChart
}
