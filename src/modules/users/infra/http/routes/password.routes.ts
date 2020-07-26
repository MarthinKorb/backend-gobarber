import { Router } from 'express';
import ForgotPasswordContoller from '../controllers/ForgotPasswordController';
import ResetPasswordContoller from '../controllers/ResetPasswordController';

const passwordRouter = Router();

const forgotPasswordContoller = new ForgotPasswordContoller();
const resetPasswordContoller = new ResetPasswordContoller();

passwordRouter.post('/forgot', forgotPasswordContoller.create);

passwordRouter.post('/reset', resetPasswordContoller.create);

export default passwordRouter;
