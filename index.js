import express from "express";
import cors from "cors";
import clienteRoute from "./src/routes/clienteRoute.js";
import departamentoRoute from "./src/routes/departamentoRoute.js";
import balcaoRoute from "./src/routes/balcaoRoute.js";
import usuarioRoute from "./src/routes/usuarioRoute.js";
import consumoRoute from "./src/routes/consumoRoute.js";
import { loadModels } from "./src/api/faceapi.js";
import { checkContentType } from "./src/middlewares/index.js";
import swaggerOutput from "./src/docs/swagger-output.json" with {type: "json"}
import swaggerUi from "swagger-ui-express";
import path from 'path';
import { rotaProtegida } from "./src/utils/index.js";
import { login } from "./src/controllers/usuarioController.js";

await loadModels();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.redirect("/docs");
});
app.post("/login", express.json(), async (req, res) => {
    // #swagger.tags = ['Usuarios']
    // #swagger.description = "Retorna o token necessario para as requisicoes seguintes"
    /* #swagger.parameters['obj'] = {
            in: 'body',
            schema: {
                $email: "texto",
                $senha: "texto"
            }
    } */
    /* #swagger.responses[200] = {
            description: 'Token gerado',
            schema: {
                type: 'success',
                description: 'Seja bem-vindo(a)',
                usuario: 'dados do usuario',
                token: 'token'
            }
    } */
    res.send(await login(req.body));
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput))
app.use("/uploads", express.static(path.join(process.cwd(), 'uploads')));
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
app.use("/departamentos",
    express.json(), rotaProtegida,
    /* #swagger.responses[422] = {
            description: 'Erro interno',
            schema: {
                type: 'error',
                description: 'mensagem do sistema',
            }
    } */
    departamentoRoute);

app.use("/balcoes",
    express.json(), rotaProtegida,
    /* #swagger.responses[422] = {
            description: 'Erro interno',
            schema: {
                type: 'error',
                description: 'mensagem do sistema',
            }
    } */
    balcaoRoute);

app.use("/usuarios",
    express.json(), rotaProtegida,
    /* #swagger.responses[422] = {
            description: 'Erro interno',
            schema: {
                type: 'error',
                description: 'mensagem do sistema',
            }
    } */
    usuarioRoute);

app.use("/consumos",
    express.json(), rotaProtegida,
    /* #swagger.responses[422] = {
            description: 'Erro interno',
            schema: {
                type: 'error',
                description: 'mensagem do sistema',
            }
    } */
    consumoRoute);

app.listen(8000, () => {
    console.log(`server on http://localhost:8000`);
});