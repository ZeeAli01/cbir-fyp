import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Prisma, users } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) { }

  // CREATE - signup POST user
  async createUser(newUser: Prisma.usersCreateInput) {
    try {
      const existingUser = await this.databaseService.users.findUnique({
        where: { username: newUser.username },
      });

      if (existingUser) {
        throw new BadRequestException('Username already exists');
      }

      const saltRounds = 10;
      if (!newUser.password_hash) {
        throw new BadRequestException('Password is required');
      }
      newUser.password_hash = await bcrypt.hash(newUser.password_hash, saltRounds);
      const user = await this.databaseService.users.create({ data: newUser });
      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // READ - GET ALL
  async getUsers(roleId?: number): Promise<users[]> {
    try {
      return await this.databaseService.users.findMany({
        where: roleId ? { role_id: roleId } : {},
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to get users');
    }
  }
  // READ - GET ONE e.g 085c4794-bfaf-4a09-af25-f14be03eb940
  async findOne(id: string) {
    try {
      const user = await this.databaseService.users.findUnique({ where: { user_id: id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get user');
    }
  }

  // get user by username
  async findByUsername(username: string) {
    try {
      const user = await this.databaseService.users.findUnique({
        where: { username },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get user by username');
    }
  }

  async validatePassword(currentPassword: string, current_password_hash: string): Promise<boolean> {
    return await bcrypt.compare(currentPassword, current_password_hash);
  }
  async update(username: string, currentpassword: string, updatedUser: Prisma.usersUpdateInput) {
    try {
      const user = await this.findByUsername(username);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const compared = this.validatePassword(currentpassword, user.password_hash);
      if (updatedUser.password_hash) {
        updatedUser.password_hash = await bcrypt.hash(updatedUser.password_hash, 10);
      }
      if (compared) {
        return await this.databaseService.users.update({
          where: { username },
          data: updatedUser,
        });
      }
      else {
        throw new UnauthorizedException('Invalid password');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to Update user');
    }
  }
  // DELETE user by username
  async deleteUser(username: string) {
    try {
      const user = await this.findByUsername(username);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      // Delete related records in the correct order
      // await this.databaseService.url.deleteMany({ where: { user_id: user.user_id } });
      // await this.databaseService.apikey.deleteMany({ where: { user_id: user.user_id } });
      // await this.databaseService.auditlog.deleteMany({ where: { changed_by: user.user_id } });
      // await this.databaseService.url.deleteMany({ where: { logo: { user_id: user.user_id } } }); // Ensure urls referencing logos are deleted
      // await this.databaseService.logo.deleteMany({ where: { user_id: user.user_id } });
      // await this.databaseService.urltag.deleteMany({ where: { user_id: user.user_id } });

      // Delete the user
      return await this.databaseService.users.delete({
        where: { user_id: user.user_id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
  async findSignInUser(username: string, role_id: number) {
    try {

      const user = await this.databaseService.users.findUnique({
        where: { username, role_id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to Find User');
    }
  }
  async updateRole(username: string, old_role_id: Role, new_role_id: Role) {
    try {
      const user = await this.findByUsername(username);

      if (!user) {
        throw new NotFoundException('User not found');
      }
      // Update the user's role
      const updatedUser = await this.databaseService.users.update({
        where: { username, role_id: old_role_id },
        data: { role_id: new_role_id }
      })
      console.log(updatedUser);
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to Update User Role');
    }
  }
}
