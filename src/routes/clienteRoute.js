import express from "express";
import multer from 'multer';
import { reconhecimento } from "../controllers/clienteController.js";

const router = express.Router();
const uploadReconhecimento = multer({ dest: 'uploads/reconhecimento' });
const uploadFacial = multer({ dest: 'uploads/facial' });

router.post("/", uploadFacial.single('foto'), async (req, res) => {
    res.send(await criar(req));
});

router.post("/reconhecimento", uploadReconhecimento.single('foto'), async (req, res) => {
    res.send(await reconhecimento(req));
});

export default router;