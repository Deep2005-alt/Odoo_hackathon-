exports.protect = (req, res, next) => {
  // Hackathon demo: Mock authentication since Member 1 has not deployed Auth yet
  req.user = { userId: 1, role: 'employee' };
  next();
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Hackathon demo: Mock authorization
    next();
  };
};
