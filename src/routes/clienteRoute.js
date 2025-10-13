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
        cb(null, `facial-${file.originalname.split(".")[0]}-${Date.getMonth()}.${extensao}`);
    }
})
const uploadReconhecimento = multer({ 
    dest: 'uploads/reconhecimento',

 });
const uploadFacial = multer({ storage: storageFacial });

router.post("/", uploadFacial.single('foto'), async (req, res) => {
    res.send(await criar(req));
});

router.post("/reconhecimento", uploadReconhecimento.single('foto'), async (req, res) => {
    res.send(await reconhecimento(req));
});

export default router;