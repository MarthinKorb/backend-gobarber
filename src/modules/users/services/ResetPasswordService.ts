import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

// import User from '../infra/typeorm/entities/User';

interface IRequest {
    token: string;
    password: string;
}

@injectable()
class ResetPasswordService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
    ) {}

    public async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.userTokensRepository.findUserByToken(
            token,
        );

        if (!userToken) {
            throw new AppError('The user Token does not exists');
        }
        const user = await this.usersRepository.findById(userToken.user_id);

        if (!user) {
            throw new AppError('The user does not exists');
        }

        user.password = password;

        await this.usersRepository.save(user);
    }
}

export default ResetPasswordService;