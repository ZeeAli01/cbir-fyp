import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { apikey } from '@prisma/client';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
    constructor(private readonly databaseService: DatabaseService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        console.log('Headers:', request.headers);
        const apiKey: string | string[] | undefined = request.headers['x-api-key'];
        console.log('apiKey:', apiKey);
        const user_id: string | undefined = request['user'] ? request['user'].user_id : null;

        if (!apiKey) {
            // If no API key is provided, assume internal access and allow request
            return true;
        }

        if (!user_id) {
            throw new UnauthorizedException('User ID is missing');
        }

        // Check in the database for the hashed API key
        const storedKey: apikey | null = await this.databaseService.apikey.findFirst({
            where: {
                user_id: user_id,
                is_deleted: false,
            },
        });

        if (!storedKey || storedKey.api_key !== apiKey) {
            throw new UnauthorizedException('Invalid API key');
        }

        return true;
    }
}
