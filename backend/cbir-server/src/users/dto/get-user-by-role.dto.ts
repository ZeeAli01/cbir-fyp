import { IsIn, IsOptional, IsString } from 'class-validator';

export class GetUsersByRoleDto {
    @IsOptional()
    @IsString()
    @IsIn(['admin', 'user'])
    role: string;
}
