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

        // Não remover o arquivo aqui: o multer salvou em uploads/facial e este
        // arquivo deve permanecer disponível via rota estática (/uploads/...).
        // Caso queira apagar depois, mova ou apague explicitamente em outro fluxo.

        if (!detection) {
            return { type: "warning", description: 'Nenhum rosto detectado na imagem.' };
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

        const detection = await faceapi
            .detectAllFaces(img)
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (!detection.length) {
            return { 
                type: "warning", 
                description: "Nenhum rosto detectado" 
            };
        }

        
        const resultado = detection[0].descriptor;

        if (resultado.length === 0) {
            return { 
                type: "warning", 
                description: "Cliente não identificado." 
            };
        }

        const clientes = await prisma.clientes.findMany();

        let melhorMatch = null;
        let menorDistancia = Infinity;

        for (const cliente of clientes) {
            const emb = new Float32Array(cliente.facial);
            const distancia = faceapi.euclideanDistance(resultado, emb);

            if (distancia < menorDistancia) {
                melhorMatch = cliente,
                    menorDistancia = distancia
            }
        }

        if (menorDistancia < 0.6) {
            return {
                type: "success",
                cliente: melhorMatch
            };
        } else {
            return {
                type: "warning",
                description: "Cliente não encontrado."
            };
        }

    } catch (err) {
        return { type: "error", description: err.message };
    }
}

export {
    reconhecimento,
    criar
}