const prisma = require('../config/prisma');

// Get all charts for a specific dashboard
exports.getAllCharts = async (req, res, next) => {
  try {
    const { dashboardId } = req.query;

    if (!dashboardId) {
      return res.status(400).json({ message: 'dashboardId query parameter is required' });
    }

    // Verify dashboard ownership
    const dashboard = await prisma.dashboard.findFirst({
      where: {
        id: dashboardId,
        userId: req.user.id
      }
    });

    if (!dashboard) {
      return res.status(404).json({ message: 'Dashboard not found or access denied' });
    }

    const charts = await prisma.chart.findMany({
      where: { dashboardId: dashboardId },
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
    });

    // Transform to snake_case
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
    }));

    res.json(transformedCharts);
  } catch (error) {
    next(error);
  }
};

// Get single chart
exports.getChart = async (req, res, next) => {
  try {
    const { id } = req.params;

    const chart = await prisma.chart.findUnique({
      where: { id },
      include: {
        dashboard: true,
        file: true
      }
    });

    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }

    // Verify ownership through dashboard
    if (chart.dashboard.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Transform to snake_case
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
    };

    res.json(transformedChart);
  } catch (error) {
    next(error);
  }
};

// Create chart
exports.createChart = async (req, res, next) => {
  try {
    const { dashboard_id, file_id, chart_type, chart_config, title } = req.body;

    // Validate required fields
    if (!dashboard_id || !file_id || !chart_type || !chart_config || !title) {
      return res.status(400).json({
        message: 'Missing required fields: dashboard_id, file_id, chart_type, chart_config, title'
      });
    }

    // Verify dashboard ownership
    const dashboard = await prisma.dashboard.findFirst({
      where: {
        id: dashboard_id,
        userId: req.user.id
      }
    });

    if (!dashboard) {
      return res.status(404).json({ message: 'Dashboard not found or access denied' });
    }

    // Verify file ownership
    const file = await prisma.file.findFirst({
      where: {
        id: file_id,
        userId: req.user.id
      }
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found or access denied' });
    }

    // Check plan limits
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        plan: true,
        dashboards: {
          include: {
            charts: true
          }
        }
      }
    });

    // Count total charts across all dashboards
    const totalCharts = user.dashboards.reduce((sum, d) => sum + d.charts.length, 0);

    if (user.plan.max_charts !== -1 && totalCharts >= user.plan.max_charts) {
      return res.status(403).json({
        message: `Chart limit reached. Your ${user.plan.name} plan allows ${user.plan.max_charts} charts.`
      });
    }

    // Create chart
    const chart = await prisma.chart.create({
      data: {
        dashboardId: dashboard_id,
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
    });

    // Transform to snake_case
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
    };

    res.status(201).json(transformedChart);
  } catch (error) {
    next(error);
  }
};

// Update chart
exports.updateChart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { chart_type, chart_config, title } = req.body;

    // Verify chart exists and user has access
    const existingChart = await prisma.chart.findUnique({
      where: { id },
      include: { dashboard: true }
    });

    if (!existingChart) {
      return res.status(404).json({ message: 'Chart not found' });
    }

    if (existingChart.dashboard.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update chart
    const updateData = {};
    if (chart_type) updateData.chartType = chart_type;
    if (chart_config) updateData.chartConfig = chart_config;
    if (title) updateData.title = title;

    const chart = await prisma.chart.update({
      where: { id },
      data: updateData,
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
    });

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
    };

    res.json(transformedChart);
  } catch (error) {
    next(error);
  }
};

// Delete chart
exports.deleteChart = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify chart exists and user has access
    const chart = await prisma.chart.findUnique({
      where: { id },
      include: { dashboard: true }
    });

    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }

    if (chart.dashboard.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete chart
    await prisma.chart.delete({
      where: { id }
    });

    res.json({ message: 'Chart deleted successfully' });
  } catch (error) {
    next(error);
  }
};
