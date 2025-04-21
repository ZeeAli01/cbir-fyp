import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards, Query, UseFilters, ForbiddenException, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma, users } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersByRoleDto } from './dto/get-user-by-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/decorators/roles.decorator'; //ROLES CUSTOM DECORATOR
import { Role } from 'src/enums/role.enum';//ROLES ENUM -> 1,2
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ManageUserRoleDto } from './dto/manage-user-role.dto';
import { ApiKeyAuthGuard } from 'common/middleware/api-key-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Get('getByUsername')
  getUser(@Query('username') username: string): Promise<users> {
    return this.usersService.findByUsername(username);
  }
  @UseGuards(AuthGuard, ApiKeyAuthGuard)
  @Roles(Role.Admin)
  @Get()
  getUsers(@Query() query: GetUsersByRoleDto): Promise<users[]> {

    // console.log('req.user = ', req.user);
    try {
      const { role } = query;
      let roleId: number = 0;
      if (role === 'admin') {
        roleId = 1;
      } else if (role === 'user') {
        roleId = 2;
      }
      return this.usersService.getUsers(roleId);
    }
    catch (error) {
      console.log(error);
    }
  }
  @Get('/:id')
  findOne(@Param('id') id: string) {

    return this.usersService.findOne(id);
  }
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('/')
  deleteUser(@Query('username') username: string) {
    return this.usersService.deleteUser(username);
  }
  @UseGuards(AuthGuard)
  @Patch()
  update(
    @Query('username') username: string,
    @Query('currentpassword') currentpassword: string,
    @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(username, currentpassword, updateUserDto);
  }

  //admin can manage role of users:
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('/updateRole')
  updateRole(@Body() manageUserRoleDto: ManageUserRoleDto) {
    return this.usersService.
      updateRole(manageUserRoleDto.username,
        manageUserRoleDto.old_role_id,
        manageUserRoleDto.new_role_id);
  }

}

