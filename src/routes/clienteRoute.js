import express from "express";
import multer from 'multer';
import { reconhecimento } from "../controllers/clienteController.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post("/reconhecimento", upload.single('foto'), async (req, res) => {
    res.send(await reconhecimento(req));
});

export default router;