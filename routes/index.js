import userRoutes from "./user.routes.js";

function initRoutes(app) {
  app.use("/api/users", userRoutes);
}

export default initRoutes;
