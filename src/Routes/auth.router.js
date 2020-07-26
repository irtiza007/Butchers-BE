import express from 'express';
import auth from '../Controllers/Auth';
import userValidator from '../validations/user';

const signInRouter = express.Router();

signInRouter.post('/', userValidator.userSignin, auth.userSignIn);

signInRouter.post('/admin', auth.adminSignin);

export default signInRouter;
