const logger = (req, res, next) => {
  const newUrl = `http://localhost:3000${req.url}`;
  console.log(`${new Date().toISOString()} - ${req.method} ${newUrl}`);
  next();
};

module.exports = logger;
