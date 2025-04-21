import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UnauthorizedException, Req } from '@nestjs/common';
import { ApikeysService } from './apikeys.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { apikey } from '@prisma/client';
import { CreateApikeyDto } from './dto/create-apikey.dto';
import { UpdateApikeyDto } from './dto/update-apikey.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
@Controller('apikeys')
// @Roles(Role.Admin)
export class ApikeysController {
  constructor(private readonly apikeysService: ApikeysService) { }
  //generate api key:
  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request): Promise<apikey | undefined> {
    try {
      const user_id: string = req['user']['user_id'];
      if (!user_id) {
        throw new UnauthorizedException('Unauthorized');
      }
      return await this.apikeysService.create(user_id);
    } catch (error) {
      throw new UnauthorizedException('You are not logged In');
    }

  }

  @Get()
  findAll() {
    return this.apikeysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apikeysService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApikeyDto: UpdateApikeyDto) {
    return this.apikeysService.update(+id, updateApikeyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apikeysService.remove(+id);
  }
}
