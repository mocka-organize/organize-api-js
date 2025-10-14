import express from "express";
import multer from 'multer';
import { criar, reconhecimento } from "../controllers/clienteController.js";

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

export default router;