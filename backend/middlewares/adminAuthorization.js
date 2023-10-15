const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Assuming you have an Admin model

function isAdmin(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    
    // Check if the user is an admin
    Admin.findById(decoded.userId, (error, admin) => {
      if (error || !admin) {
        return res.status(403).json({ message: 'Admin access denied' });
      }
      req.adminId = admin._id;
      next();
    });
  });
}

module.exports = isAdmin;