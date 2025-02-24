import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Inject,
  BadRequestException
} from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Transfer } from './entities/transfer.entity';

@Injectable()
export class TransfersService {
  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('TRANSFER_REPOSITORY')
    private transferRepository: Repository<Transfer>,
  ) {}

  async findAll() {
    return this.transferRepository.find();
  }

  async create(createTransferDto: CreateTransferDto) {
    try {
      if (createTransferDto.amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }

      await this.verifyUsers(createTransferDto);
      await this.updateBalances(createTransferDto);
      await this.transferRepository.save(createTransferDto); // Cria transação

      return;
    } catch (error) {

      throw new InternalServerErrorException('Unable to process transaction');
    }
  }

  // --- Funções axiliares ---

  private async verifyUsers(CreateTransferDto: CreateTransferDto) {
    try {
      const { fromId, toId } = CreateTransferDto;
      const [fromUser, toUser] = await Promise.all([
        this.userRepository.findOne({ where: { id: Number(fromId) } }),
        this.userRepository.findOne({ where: { id: Number(toId) } })
      ]);
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

  private async updateBalances(createTrsansactionDto: CreateTransferDto) {
    const { fromId, toId, amount } = createTrsansactionDto;

    try {

      await this.dataSource.manager.transaction(async transactionalEntityManager => {
        const resultFromUser = await transactionalEntityManager
          .createQueryBuilder()
          .update(User)
          .set({
            balance: () => `balance - :amount`
          })
          .where("id = :id")
          .andWhere("balance >= :amount")
          .setParameters({ 
            id: fromId,
            amount: amount
          })
          .execute();
  
        if (resultFromUser.affected === 0 ) {
          throw new BadRequestException(`Insuficient balance for user ${fromId} to transfer ${amount}.`);
        }
  
        const resultToUser = await transactionalEntityManager
          .createQueryBuilder()
          .update(User)
          .set({
            balance: () => `balance + :amount`
          })
          .where("id = :id")
          .setParameters({ 
            id: toId,
            amount: amount
          })
          .execute();
  
          if (resultToUser.affected === 0) {
            throw new Error(`Failed to update balance of user ${toId}`);
          }
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update balances');
    }

  }
}
