// Admin authorization middleware
// Checks if authenticated user has admin privileges

const checkAdmin = (req, res, next) => {
  // Middleware auth.js already verified JWT and attached req.user
  
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required' 
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ 
      message: 'Admin access required. This action is restricted to administrators.' 
    });
  }

  // User is admin, proceed
  next();
};

module.exports = { checkAdmin };
