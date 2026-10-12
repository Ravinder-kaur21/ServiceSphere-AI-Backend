export function allowRoles(...roles) {
  return (req, res, next) => {
    const currentUser = req.user;

    if (!currentUser || !roles.includes(currentUser.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    next();
  };
}
