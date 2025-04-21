//sign up dto
import { IsEmail, IsNotEmpty, IsInt, IsIn, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsInt()
    @IsIn([1, 2])
    role_id: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    password_hash: string;
}
