//update user  dto
import { IsEmail, IsOptional, IsInt, IsIn, IsString, MinLength, } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    username?: string;

    // @IsOptional()
    // @IsInt()
    // @IsIn([1, 2])
    // role_id?: number;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(5)
    password_hash?: string;


}
