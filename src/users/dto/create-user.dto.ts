import { CredentialsUserDto } from './credentials-user.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto extends CredentialsUserDto {
  @IsString()
  @IsNotEmpty()
  birthdate: string;
}
