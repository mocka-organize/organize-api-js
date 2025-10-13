import express from "express";
import cors from "cors";
import clienteRoute from "./src/routes/clienteRoute.js"
import { loadModels } from "./src/api/faceapi.js";
import { checkContentType } from "./src/middlewares/index.js";

await loadModels();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("root");
});

app.use("/uploads", express.static("./uploads/"));
app.use("/models", express.static("./../models"));
app.use("/clientes", checkContentType, clienteRoute);

app.listen(8000, () => {
    console.log(`server on http://localhost:8000`);
});