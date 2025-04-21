//sign in dto
import { IsNotEmpty, IsInt, IsIn, IsString, MinLength } from 'class-validator';
export class SignInDto {
    @IsNotEmpty()
    @IsString()
    username: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    password_hash: string;
    @IsNotEmpty()
    @IsInt()
    @IsIn([1, 2])
    role_id: number;
}