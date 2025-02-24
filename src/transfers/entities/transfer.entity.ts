import {
	IsNumber,
	IsPositive,
	IsString
} from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity
} from 'typeorm';

@Entity()
export class Transfer extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@IsString()
	@Column({ length: 45 })
	fromId: string;

	@IsString()
	@Column({ length: 45 })
	toId: string;

	@IsNumber()
	@IsPositive()
	@Column(
		'decimal',
		{
			precision: 12,
			scale: 2,
		}
	)
	amount: number;
}