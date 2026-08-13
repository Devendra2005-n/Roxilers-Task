import { IsString, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/, {
    message: 'Password must be 8-16 chars, include uppercase and special character',
  })
  newPassword: string;
}
