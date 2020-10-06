import {body} from 'express-validator';

const validations = [
    body('password').exists().withMessage('Password is required'),
    body('password').if(body('password').exists()).isLength({min:7}).withMessage('invalid Password length, must be at least 7 characters'),
    body('email').exists().withMessage('Email is required'),
    body('email').if(body('email').exists()).isEmail().withMessage('Invalid Email Format'),
    body('name').exists().withMessage('Name is required'),
    body('name').if(body('name').exists()).isLength({min:3}).withMessage('Invalid Namme Length, min length is 3 characters')    
];
export default validations;