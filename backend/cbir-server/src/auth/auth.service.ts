import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }
  //authenticate:
  async authenticate(username: string, password: string, role_id: number) {
    const user = await this.validateUser(username, password, role_id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.signIn(user.user_id, user.username, user.role_id);
  }
  //validate the user:
  async validateUser(username: string, password: string, role_id: number) {
    const user = await this.usersService.findSignInUser(username, role_id);

    if (user && bcrypt.compare(password, user.password_hash)) {
      // console.log("done");
      return {
        user_id: user.user_id,
        username: user.username,
        role_id: user.role_id,
      }
    }
    return null;
  }
  async signIn(user_id: string, username: string, role_id: number) {

    const tokenPayload = {
      user_id: user_id,
      username: username,
      role: role_id,
      role_id: role_id,

    }
    console.log("\n\n##############################token payload " + tokenPayload.user_id, tokenPayload.role_id, tokenPayload.username);
    //console.log("PROCESS.ENV.JWT", process.env.JWT_SECRET);
    try {
      const accessToken = await this.jwtService.signAsync(tokenPayload, { expiresIn: '12h' });
      console.log("Access token: " + accessToken)
      return { accessToken, username: username, user_id: user_id, role_id: role_id, role: role_id };
    } catch (error) {
      throw new Error('Token Generation Failed');
    }

  }


}
