import express from 'express';

const jsonMidlleware = express();
function checkContentType(req, res, next){
    if(req.is('application/json')){
        return jsonMidlleware((req, res, next));
    }else{
        next()
    }
}

export { checkContentType }