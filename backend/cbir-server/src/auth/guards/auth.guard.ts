import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization; //bearer token
        const token = authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException();
        }
        //verify it the token is valid:
        try {
            const tokenPayload = await this.jwtService.verifyAsync(token);
            // console.log("token payload in auth guard: ", tokenPayload);
            request.user = tokenPayload;
            return true;
        } catch (error) {
            throw new UnauthorizedException("the token is invalid");
        }

    }
}