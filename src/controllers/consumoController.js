import { prisma } from '../services/prismaService.js';

async function buscarTodos() {
    try {
        return await prisma.consumos.findMany();
    } catch (error) {
        return { type: "error", description: error.message };
    }
}

async function buscarUm(id) {
    try {
        return await prisma.consumos.findFirst({
            where: {
                departamento_id: Number(id)
            }
        });
    } catch (error) {
        return { type: "error", description: error.message };
    }
}

async function criar(dados) {
    try {
        const result = await prisma.consumos.create({
            data: dados
        });
        if(result){
            return { 
                type: "success", 
                description: 'Registro criado com sucesso!'
            };
        }
    } catch (error) {
        return { type: "error", description: error.message };
    }
}

async function editar(dados, id) {
    try {
        const result = await prisma.consumos.update({
            where: {
                departamento_id: Number(id)
            },
            data: dados
        });
        if(result){
            return { 
                type: "success", 
                description: 'Registro criado com sucesso!'
            };
        }
    } catch (error) {
        return { type: "error", description: error.message };
    }
}

async function deletar(id) {
    try {
        const result = await prisma.consumos.delete({
            where: {
                departamento_id: Number(id)
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




export {
    buscarTodos,
    buscarUm,
    criar,
    editar,
    deletar
}