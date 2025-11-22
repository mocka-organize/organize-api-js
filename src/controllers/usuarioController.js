import { prisma } from '../services/prismaService.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function buscarTodos() {
    try {
        return await prisma.usuarios.findMany();
    } catch (error) {
        return { type: "error", description: error.message };
    }
}

async function buscarUm(id) {
    try {
        return await prisma.usuarios.findFirst({
            where: {
                usuario_id: Number(id)
            }
        });
    } catch (error) {
        return { type: "error", description: error.message };
    }
}

async function criar(dados) {
    try {
        const emailCadastrado = await prisma.usuarios.findFirst({
            where: {
                email: dados.email
            }
        })
        if (emailCadastrado) {
            return {
                type: "warning",
                description: "Já existe um usuário com esse email"
            }
        } else {
            const senhaCriptografada = await bcrypt.hash(dados.senha, 10);
            const result = await prisma.usuarios.create({
                data: { ...dados, senha: senhaCriptografada }
            });

            if (result) {
                return {
                    type: "success",
                    description: "Registro criado com sucesso"
                }
            }
        }
    } catch (error) {
        return { type: "error", description: error.message };
    }
}

async function editar(dados, id) {
    try {
        const senhaCriptografada = await bcrypt.hash(dados.senha, 10);
        const result = await prisma.usuarios.update({
            data: { ...dados, senha: senhaCriptografada },
            where: {
                usuario_id: Number(id)
            }
        });

        if (result) {
            return {
                type: "success",
                description: "Registro atualizado com sucesso"
            }
        }
    } catch (error) {
        return { type: "error", description: error.message };
    }
}

async function deletar(id) {
    try {
        const result = await prisma.usuarios.delete({
            where: {
                usuario_id: Number(id)
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

async function login(dados) {
    try {
        const usuario = await prisma.usuarios.findFirst({
            where: {
                email: dados.email
            }
        })

        if (usuario) {
            let senhaEstaCorreta = await bcrypt.compare(dados.senha, usuario.senha)
            if (senhaEstaCorreta) {
                let token = jwt.sign({ usuario_id: usuario.usuario_id }, process.env.CHAVE, { expiresIn: "1h" });
                delete usuario.senha;
                return {
                    type: "success",
                    description: "Seja bem-vindo(a)",
                    usuario,
                    token
                };
            } else {
                return {
                    type: "warning",
                    description: "Email ou senha inválido"
                }
            }
        }
        return {
            type: "warning",
            description: "Email ou senha inválido"
        }
    } catch (error) {
        return {
            type: "error",
            description: error.message
        }
    }
}


export {
    buscarTodos,
    buscarUm,
    criar,
    editar,
    deletar,
    login
}