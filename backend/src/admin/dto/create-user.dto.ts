import { IsEmail, IsEnum, IsString, Length, Matches, MaxLength, IsOptional } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class CreateUserDto {
  @IsString()
  @Length(20, 60)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/)
  password: string;

  @IsString()
  @MaxLength(400)
  address: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsOptional()
  storeId?: string;
}
