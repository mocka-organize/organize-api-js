import { faceapi, canvas } from '../api/faceapi.js';
import fs from 'fs';
import path from 'path';
import { reconhecerCliente } from '../services/clienteService.js';
import { prisma } from '../services/prismaService.js';


async function criar(req) {
    try {
        const dados = req.body;
        const imagePath = req.file.path;

        const img = await canvas.loadImage(imagePath);
        const detection = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

        // Remove arquivo temporário
        fs.unlinkSync(imagePath);

        if (!detection) {
            return res.status(400).json({ type: "warning", description: 'Nenhum rosto detectado na imagem.' });
        }

        const descriptor = Array.from(detection.descriptor);

        const face = await prisma.clientes.create({
            data: {
                ...dados,
                foto: `${req.protocol}://${req.headers.host}/${imagePath}`,
                facial: descriptor,
            },
        });

        return { type: "success", description: 'Registro criado com sucesso!', face };
    } catch (error) {
        return { type: "error", description: error.message };
    }
}

async function reconhecimento(req) {
    try {
        const imgPath = path.resolve(req.file.path);
        const img = await canvas.loadImage(imgPath);

        const detections = await faceapi.detectAllFaces(img)
            .withFaceLandmarks()
            .withFaceDescriptors();

        fs.unlinkSync(imgPath); // apagar a imagem temporária

        if (!detections.length) {
            return { type: "warning", description: "Nenhum rosto detectado" };
        }

        const resultados = reconhecerCliente(detections);

        if (resultados.length === 0) {
            return { type: "warning", description: "Cliente não identificado." };
        }

        return { type: "success", clientes: resultados };

    } catch (err) {
        return { type: "error", description: err.message };
    }
}

export { 
    reconhecimento,
    criar
}