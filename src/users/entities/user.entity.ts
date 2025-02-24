import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255, unique: true })
	username: string;

	@Column({ length: 255 })
	password: string;

	@Column({ length: 45 })
	birthdate: string;

  @Column(
    'decimal',
    {
      precision: 12,
      scale: 2,
      default: 1000,
    }
  )
  balance: number;
}
