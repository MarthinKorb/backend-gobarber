import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IMAilProvider from './models/IMailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

const providers = {
    ethereal: container.resolve(EtherealMailProvider),
    ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMAilProvider>(
    'MailProvider',
    providers[mailConfig.driver],
);
