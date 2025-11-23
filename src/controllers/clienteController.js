import { faceapi, canvas } from '../api/faceapi.js';
import path from 'path';
import { prisma } from '../services/prismaService.js';

async function buscarTodos() {
    try {
        return await prisma.clientes.findMany();
    } catch (error) {
        return { type: "error", description: error.message };
    }
}

async function buscarUm(id) {
    try {
        return await prisma.clientes.findFirst({
            where: {
                cliente_id: Number(id)
            }
        });
    } catch (error) {
        return { type: "error", description: error.message };
    }
}

async function deletar(id) {
    try {
        const result = await prisma.clientes.delete({
            where: {
                cliente_id: Number(id)
            }
        });
        if(result){
            return {
                type:"success",
                description: "Registro apagado com sucesso!"
            }
        }
    } catch (error) {
        return { type: "error", description: error.message };
    }
}
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

        const relativePath = path.relative(process.cwd(), imagePath).split(path.sep).join('/');
        const fotoUrl = `${req.protocol}://${req.get('host')}/${relativePath}`;

        const face = await prisma.clientes.create({
            data: {
                ...dados,
                foto: fotoUrl,
                facial: descriptor,
            },
        });

        return { type: "success", description: 'Registro criado com sucesso!', face };
    } catch (error) {
        return { type: "error", description: error.message };
    }
}

async function editar(req) {
    try {
        const dados = req.body;

        // Remove cliente_id do body se vier
        if ("cliente_id" in dados) {
            delete dados.cliente_id;
        }

        let fotoUrl = null;
        let descriptor = null;

        if (req.file) {
            const imagePath = req.file.path;

            const img = await canvas.loadImage(imagePath);
            const detection = await faceapi
                .detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                return { type: "warning", description: 'Nenhum rosto detectado na imagem.' };
            }

            descriptor = Array.from(detection.descriptor);

            const relativePath = path.relative(process.cwd(), imagePath).split(path.sep).join('/');
            fotoUrl = `${req.protocol}://${req.get('host')}/${relativePath}`;
        }

        const updateData = {
            ...dados,
        };

        if (fotoUrl) updateData.foto = fotoUrl;
        if (descriptor) updateData.facial = descriptor;

        const face = await prisma.clientes.update({
            data: updateData,
            where: {
                cliente_id: Number(req.params.id)
            }
        });

        return { type: "success", description: 'Registro atualizado com sucesso!', face };

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

        const clientes = await prisma.clientes.findMany();
        let melhorMatch = null;
        let menorDistancia = Infinity;

        for (const cliente of clientes) {
            const emb = new Float32Array(cliente.facial);
            const distancia = faceapi.euclideanDistance(resultado, emb);

            if (distancia < menorDistancia) {
                melhorMatch = cliente;
                menorDistancia = distancia;
            }
        }

        if (menorDistancia < 0.6) {
            const hoje = new Date();
            hoje.setHours(0,0,0,0);

            const consumoHoje = await prisma.consumos.findFirst({
                where: {
                    cliente_id: melhorMatch.cliente_id,
                    created_at: {
                        gte: hoje 
                    }
                }
            });

            if (!consumoHoje) {
                await prisma.consumos.create({
                    data: {
                        cliente_id: melhorMatch.cliente_id,
                        balcao_id: Number(req.body.balcao_id) ?? 1,
                        consumo: null
                    }
                });
            }

            return {
                type: "success",
                cliente: melhorMatch
            };
        }

        return { type: "warning", description: "Cliente não encontrado." };

    } catch (err) {
        return { type: "error", description: err.message };
    }
}


export {
    reconhecimento,
    criar,
    editar,
    buscarTodos,
    buscarUm,
    deletar
}
