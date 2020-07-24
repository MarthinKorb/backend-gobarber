// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
// import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
// let sendForgotPasswordEmail: SendForgotPasswordEmailService;
let resetPassword: ResetPasswordService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
        );
    });

    it('should be able to reset the password ', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@gmail.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        await resetPassword.execute({
            token,
            password: '1234567',
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(updatedUser?.password).toBe('1234567');
    });
});
