import { faceapi, canvas } from '../api/faceapi.js';
import fs from 'fs';
import path from 'path';
import { reconhecerCliente } from '../services/clienteService.js';

async function reconhecimento(req) {
    try {
        const imgPath = path.resolve(req.file.path);
        const img = await canvas.loadImage(imgPath);

        const detections = await faceapi.detectAllFaces(img)
            .withFaceLandmarks()
            .withFaceDescriptors();

        fs.unlinkSync(imgPath); // apagar a imagem temporária

    if (!detections.length) {
        return { sucesso: false, mensagem: "Nenhum rosto detectado" };
    }

    const resultados = reconhecerCliente(detections);

    if (resultados.length === 0) {
        return { sucesso: false, mensagem: "Cliente não identificado." };
    }

    return { sucesso: true, clientes: resultados };
    } catch (err) {
        console.error(err);
    return { sucesso: false, erro: err.message };
    }
}

export { reconhecimento }