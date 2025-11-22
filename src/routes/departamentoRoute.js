import express from "express";
import { buscarTodos, buscarUm, criar, deletar, editar } from "../controllers/departamentoController.js";

const router = express.Router();

router.get("/", async (req, res) => {
    // #swagger.tags = ['Departamentos']
    // #swagger.description = 'Retorna lista de registros'
    /* #swagger.responses[200] = {
            description: 'Retorna lista de registros',
            schema: [{
                departamento_id: 1,
                nome: "nome",
            }]
    } */
    res.json(await buscarTodos());
});

router.get("/:id", async (req, res) => {
    // #swagger.tags = ['Departamentos']
    // #swagger.description = 'Retorna um registro'
    /* #swagger.responses[200] = {
            description: 'Retorna um registro',
            schema: {
                id: 1,
                nome: "nome",
                email: "email@email.com",
                foto: "url da imagem",
                facial: "json da facial",
                created_at: "data",
                updated_at: "data"
            }
    } */
    res.send(await buscarUm(req.params.id));
});

router.post("/", async (req, res) => {
    // #swagger.tags = ['Departamentos']
    // #swagger.description = "Cria um registro"
    /* #swagger.parameters['obj'] = {
            in: 'body',
            schema: {
                $nome: "texto"
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
    // #swagger.tags = ['Departamentos']
    // #swagger.description = "Edita um registro"
    /* #swagger.parameters['obj'] = {
            in: 'body',
            schema: {
                $departamento_id: 1,
                $nome: "texto"
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
    // #swagger.tags = ['Departamentos']
    // #swagger.description = 'Deleta um registro'
    /* #swagger.responses[200] = {
            type: 'success', 
            description: 'Registro deletado com sucesso',
    } */
    res.send(await deletar(req.params.id));
});

export default router;