import {
	IsNotEmpty,
	IsNumber,
	IsPositive,
	IsString
} from "class-validator";

export class CreateTransferDto {
	@IsString()
	@IsNotEmpty()
	fromId: string;

	@IsString()
	@IsNotEmpty()
	toId: string;

	@IsNumber()
	@IsPositive()
	@IsNotEmpty()
	amount: number;
}
