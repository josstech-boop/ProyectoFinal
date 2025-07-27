const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'Acceso prohibido' });
    }
    next();
  };
  
  module.exports = checkRole;