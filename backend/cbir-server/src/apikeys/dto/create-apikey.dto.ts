import { IsBoolean, IsDate, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateApikeyDto {

    @IsUUID()
    @IsString()
    user_id: string;

    @IsString()
    @MaxLength(255)
    api_key: string;

    @IsOptional()
    @IsDate()
    expires_at?: Date;

    @IsOptional()
    @IsDate()
    created_at?: Date;

    @IsOptional()
    @IsDate()
    updated_at?: Date;

    @IsOptional()
    @IsDate()
    deleted_at?: Date;

    @IsOptional()
    @IsBoolean()
    is_deleted?: boolean;
}
