import express from "express";
import cors from "cors";
import clienteRoute from "./src/routes/clienteRoute.js"
import { loadModels } from './src/api/faceapi.js';

await loadModels();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("root");
});

app.use("/clientes", clienteRoute);

app.listen(8000, () => {
    console.log(`server on http://localhost:8000`);
});