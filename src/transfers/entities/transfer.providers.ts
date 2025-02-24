import { userProviders } from "src/users/entities/user.providers";
import { DataSource } from "typeorm";
import { Transfer } from "./transfer.entity";

export const transferProviders = [
  {
    provide: 'TRANSFER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Transfer),
    inject: ['DATA_SOURCE'],
  },
];
