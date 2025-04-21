import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() body: SignInDto) {
        console.log("SIGN IN DATA = \n", body);
        return this.authService.authenticate(body.username, body.password_hash, body.role_id);
    }
}
