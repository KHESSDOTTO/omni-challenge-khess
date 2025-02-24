import { Injectable, InternalServerErrorException, NotFoundException, Inject } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      await this.verifyUsers(createTransactionDto);
      const amount = createTransactionDto.amount;

      // YET TO FINISH!!
      await this.dataSource.manager.transaction(async transactionalEntityManager => {
        await transactionalEntityManager.update(User, fromUserId, {
          balance: () => `balance - ${amount}`
        });
  
        await transactionalEntityManager.update(User, toUserId, {
          balance: () => `balance + ${amount}`
        });
      });
      // YET TO FINISH!!

    } catch (e) {

      throw new InternalServerErrorException('Unable to process transaction');
    }


    /* Yet to finish */
  }

  private async verifyUsers(createTransactionDto: CreateTransactionDto) {
    try {
      const fromUser = await User.find({});
      const toUser = await User.find({});
      const noUsersFound = ! fromUser && ! toUser;

      let msg = '';

      if (noUsersFound) {
        msg = 'Users not found';
      } else if (! fromUser) {
        msg = '"from" user not found';
      } else if (! toUser) {
        msg = '"to" user not found';
      } else {

        return { fromUser, toUser };
      }

      throw new NotFoundException(msg)
    } catch (e) {

      throw new InternalServerErrorException('Failed to fetch users.')
    }

  }
}
