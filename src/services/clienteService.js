import fs from 'fs';
import path from 'path';
// import { faceapi } from '../../src/api/faceapi.js';

// Função para calcular distância euclidiana entre dois vetores
function euclideanDistance(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

export function reconhecerCliente(deteccoes) {
    const embeddingsPath = path.resolve('src/mock/embeddings.json');
    const db = JSON.parse(fs.readFileSync(embeddingsPath, 'utf8'));

    const resultados = [];

    for (const det of deteccoes) {
        let melhorMatch = { clienteId: null, nome: null, distancia: 1.0 };

        for (const cliente of db) {
            const distancia = euclideanDistance(det.descriptor, cliente.embedding);
            if (distancia < melhorMatch.distancia) {
                melhorMatch = { ...cliente, distancia };
            }
        }

        if (melhorMatch.distancia < 0.6) { // limiar de confiança
            resultados.push({
                clienteId: melhorMatch.clienteId,
                nome: melhorMatch.nome,
                confianca: (1 - melhorMatch.distancia).toFixed(2)
            });
        }
    }

    return resultados;
}
