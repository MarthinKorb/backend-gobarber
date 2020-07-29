import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '12345',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John True',
            email: 'johntrue@gmail.com',
        });

        expect(updatedUser.name).toBe('John True');
        expect(updatedUser.email).toBe('johntrue@gmail.com');
    });

    it('should not be able to update the profile that does not exist', async () => {
        await expect(
            updateProfile.execute({
                user_id: 'non-existing',
                email: 'test@test.com',
                name: 'test',
                // old_password: '',
                // password: '',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to change to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '12345',
        });

        const user = await fakeUsersRepository.create({
            name: 'Test',
            email: 'test@example.com',
            password: '12345',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Doe',
                email: 'john@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '12345',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John True',
            email: 'johntrue@gmail.com',
            old_password: '12345',
            password: '123456',
        });

        expect(updatedUser.password).toBe('123456');
    });

    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '12345',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John True',
                email: 'johntrue@gmail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password without wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '12345',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John True',
                email: 'johntrue@gmail.com',
                old_password: 'wrong-old-password',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
