const userRoutes = require("./user.routes").default;

function initRoutes(app) {
  app.use("/api/users", userRoutes);
}

module.exports = initRoutes;
