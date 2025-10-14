import express from "express";
import cors from "cors";
import clienteRoute from "./src/routes/clienteRoute.js";
import { loadModels } from "./src/api/faceapi.js";
import { checkContentType } from "./src/middlewares/index.js";
import swaggerOutput from "./src/docs/swagger-output.json" with {type: "json"}
import swaggerUi from "swagger-ui-express";

await loadModels();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.redirect("/docs");
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput))
app.use("/uploads", express.static("./uploads/"));
app.use("/models", express.static("./../models"));
app.use("/clientes", 
    checkContentType, 
    /* #swagger.responses[422] = {
            description: 'Erro interno',
            schema: {
                type: 'error',
                description: 'mensagem do sistema',
            }
    } */
    clienteRoute);

app.listen(8000, () => {
    console.log(`server on http://localhost:8000`);
});