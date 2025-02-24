import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 45 })
	fromId: string;

	@Column({ length: 45 })
	toId: string;

	@Column(
		'decimal',
		{
			precision: 12,
			scale: 2,
		}
	)
	amount: number;
}