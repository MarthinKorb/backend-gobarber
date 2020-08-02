import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ForgotPasswordContoller from '../controllers/ForgotPasswordController';
import ResetPasswordContoller from '../controllers/ResetPasswordController';

const passwordRouter = Router();

const forgotPasswordContoller = new ForgotPasswordContoller();
const resetPasswordContoller = new ResetPasswordContoller();

passwordRouter.post(
    '/forgot',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
        },
    }),
    forgotPasswordContoller.create,
);

passwordRouter.post(
    '/reset',
    celebrate({
        [Segments.BODY]: {
            token: Joi.string().uuid().required(),
            password: Joi.string().required(),
            password_confirmation: Joi.string()
                .required()
                .valid(Joi.ref('password')),
        },
    }),
    resetPasswordContoller.create,
);

export default passwordRouter;
