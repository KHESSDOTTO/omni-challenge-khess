import { IsString, IsNotEmpty } from 'class-validator';

export class CredentialsUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}