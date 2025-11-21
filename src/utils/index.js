import jwt from "jsonwebtoken";

export const rotaProtegida = (req, res, next) => {
    try {
        if(!req.headers.authorization){
            throw new Error("Token é necessário");
        }
        let token = req.headers.authorization.split(" ")[1];
        if (token) {
            jwt.verify(token, process.env.CHAVE, (error) => {
                if (error) {
                    res.json({
                        type: "warning",
                        description: error.message
                    })
                } else {
                    next();
                }
            });
        } else {
            res.json({
                type: "warning",
                description: "Token é necessário"
            })
        }
    } catch (error) {
        res.json({
            type: "error",
            description: error.message
        })
    }
}