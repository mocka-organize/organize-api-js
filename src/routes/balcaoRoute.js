import express from "express";
import { buscarTodos, buscarUm, criar, deletar, editar } from "../controllers/balcaoController.js";

const router = express.Router();

router.get("/", async (req, res) => {
    // #swagger.tags = ['Balcoes']
    // #swagger.description = 'Retorna lista de registros'
    /* #swagger.responses[200] = {
            description: 'Retorna lista de registros',
            schema: [{
                balcao_id: 1,
                localizacao: "texto",
                status: 1,
                created_at: "data",
                updated_at: "data"
            }]
    } */
    res.json(await buscarTodos());
});

router.get("/:id", async (req, res) => {
    // #swagger.tags = ['Balcoes']
    // #swagger.description = 'Retorna um registro'
    /* #swagger.responses[200] = {
            description: 'Retorna um registro',
            schema: {
                balcao_id: 1,
                localizacao: "texto",
                status: 1,
                created_at: "data",
                updated_at: "data"
            }
    } */
    res.send(await buscarUm(req.params.id));
});

router.post("/", async (req, res) => {
    // #swagger.tags = ['Balcoes']
    // #swagger.description = "Cria um registro"
    /* #swagger.parameters['obj'] = {
            in: 'body',
            schema: {
                $nome: "texto",
                $localizacao: "texto",
                $status: 1
            }
    } */
    /* #swagger.responses[200] = {
            description: 'Registro criado com sucesso',
            schema: {
                type: 'success',
                description: 'Registro criado com sucesso.',
            }
    } */
    res.send(await criar(req.body));
});

router.put("/:id", async (req, res) => {
    // #swagger.tags = ['Balcoes']
    // #swagger.description = "Edita um registro"
    /* #swagger.parameters['obj'] = {
            in: 'body',
            schema: {
                $balcao_id: 1,
                $nome: "texto",
                $localizacao: "texto",
                $status: 1
            }
    } */
    /* #swagger.responses[200] = {
            description: 'Registro atualizado',
            schema: {
                type: 'success',
                description: 'Registro atualizado com sucesso.',
            }
    } */
    res.send(await editar(req.body, req.params.id));
});

router.delete("/:id", async (req, res) => {
    // #swagger.tags = ['Balcoes']
    // #swagger.description = 'Deleta um registro'
    /* #swagger.responses[200] = {
            type: 'success', 
            description: 'Registro deletado com sucesso',
    } */
    res.send(await deletar(req.params.id));
});

export default router;