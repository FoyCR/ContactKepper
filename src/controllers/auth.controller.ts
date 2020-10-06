import {Request, Response, Router} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import {ErrorHandler, handleError} from '../error';
import User from '../models/user';
import bodyAuthValidators from '../middlewares/auth/auth.validator';
import validationHandler from '../middlewares/validator';

const router = Router();

router.post('/',bodyAuthValidators, validationHandler, async (req:Request, res:Response) => {
    const{email, password} = req.body;
    try {
        //se ubica el usuario en la base de datos mongo
        let user = await User.findOne({email});
        
        //Si encuentra el usuariop en la base de datos
        if (user) {
            
            //Comparamos con bcrypt los password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                const customError = new ErrorHandler(400, 'Invalid Credentials');                
                handleError(customError, req, res);      
            }

            //Objeto para generar el token jwt
            const payload = {
                user:{  
                    id: user.id
                }
            }
            
            //Creacion del token de sesion
            jwt.sign(payload, config.get('jwt_secret'),{expiresIn:3600}, (err, token) => {
                if (err) throw err;
                res.status(200).json(token);                
            });
            
        }
        else { //si no encuentra el usuario en la base de datos
            const customError = new ErrorHandler(400, 'Invalid User');
            handleError(customError, req, res);                
        }
    }
    catch(err) { //Encaso de que se produzca cualquier error en el controller
        console.log(err);
        const custom = new ErrorHandler(500, 'Server Error');
        handleError(custom, req, res);    
    }        
})

export default router;
