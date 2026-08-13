import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @Length(20, 60, { message: 'Name must be between 20 and 60 characters' })
  name: string;

  @IsEmail({}, { message: 'Must be a valid email' })
  email: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/, {
    message: 'Password must be 8-16 chars, include uppercase and special character',
  })
  password: string;

  @IsString()
  @MaxLength(400, { message: 'Address must not exceed 400 characters' })
  address: string;
}
