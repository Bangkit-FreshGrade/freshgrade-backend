import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
