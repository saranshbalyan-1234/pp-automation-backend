import express from "express";
import swaggerUi from "swagger-ui-express";

//swagger
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerFile = require("../swagger.json");
//swagger

const Router = express.Router();

Router.get("/health", (req, res) => {
    /*  #swagger.tags = ["Health"] */
    return res.json("Server is Working");
});

Router.use("/swagger", swaggerUi.serve);
Router.get("/swagger", swaggerUi.setup(swaggerFile));

Router.get("/favico.ico", (req, res) => {
    res.sendStatus(204);
});

export default Router;
