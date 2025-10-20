import express from "express";
import multer from 'multer';
import { buscarTodos, buscarUm, criar, deletar, reconhecimento } from "../controllers/clienteController.js";

const router = express.Router();
const storageFacial = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/facial');
    },
    filename: (req, file, cb) => {
        let extensao = file.originalname.split(".").reverse().shift();
        cb(null, `facial-${file.originalname.split(".")[0]}-${new Date().getHours()}${new Date().getMinutes()}.${extensao}`);
    }
})
const uploadReconhecimento = multer({ 
    dest: 'uploads/reconhecimento',

 });
const uploadFacial = multer({ storage: storageFacial });

router.get("/", async (req, res) => {
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Retorna lista de clientes'
    /* #swagger.responses[200] = {
            description: 'Retorna lista de clientes',
            schema: [{
                id: 1,
                nome: "nome",
                email: "email@email.com",
                foto: "url da imagem",
                facial: "json da facial",
                created_at: "data",
                updated_at: "data"
            }]
    } */
    res.send(await buscarTodos());
});

router.get("/:id", async (req, res) => {
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Retorna um cliente'
    /* #swagger.responses[200] = {
            description: 'Retorna um cliente',
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

router.post("/", uploadFacial.single('foto'), async (req, res) => {
    // #swagger.description = "Cria um registro"
    /* #swagger.consumes = ['multipart/form-data'] */
    /* #swagger.parameters['nome'] = { in: 'formData', type: 'string', required: true, description: 'Nome do cliente', example: 'nome' } */
    /* #swagger.parameters['email'] = { in: 'formData', type: 'string', required: true, description: 'E-mail do cliente', example: 'email@email.com' } */
    /* #swagger.parameters['foto'] = { in: 'formData', type: 'file', name: 'foto', required: true, description: 'Arquivo de imagem' } */
    /* #swagger.responses[200] = {
            description: 'Registro criado com sucesso',
            schema: {
                type: 'success',
                description: 'Registro criado com sucesso.',
            }
    } */
    res.send(await criar(req));
});

router.post("/reconhecimento", uploadReconhecimento.single('foto'), async (req, res) => {
    // #swagger.description = "Reconheci um rosto na imagem"
    /* #swagger.consumes = ['multipart/form-data'] */
    /* #swagger.parameters['foto'] = { in: 'formData', type: 'file', name: 'foto', required: true, description: 'Arquivo de imagem para reconhecimento' } */
    /* #swagger.responses[200] = {
            description: 'Registro criado com sucesso',
            schema: {
                type: 'success',
                cliente:  {
                    nome: "nome",
                    email: "email@email.com",
                    foto: "https://host/uploads/facial/imagem.jpg"
                }
            }
    } */
    res.send(await reconhecimento(req));
});

router.delete("/:id", async (req, res) => {
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Deleta um cliente'
    /* #swagger.responses[200] = {
            type: 'success', 
            description: 'Deleta um cliente',
    } */
    res.send(await deletar(req.params.id));
});

export default router;