import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';
import { apikey } from '@prisma/client';
import { randomBytes } from 'crypto';
import { UpdateApikeyDto } from './dto/update-apikey.dto';
@Injectable()
export class ApikeysService {
  constructor(private readonly databaseService: DatabaseService) { }
  generateApiKey(): string {
    return randomBytes(32).toString('hex');
  }
  async create(user_id: string): Promise<apikey | undefined> {
    try {
      const apiKey: string = this.generateApiKey();
      const newApikey: apikey = await this.databaseService.apikey.create({
        data: {
          user_id: user_id,
          api_key: apiKey,
        }
      })
      if (!newApikey) {
        return undefined;
      }
      return newApikey;
    } catch (error) {
      throw new InternalServerErrorException('ERROR GENERATING API KEY');
    }
  }

  findAll() {
    return `This action returns all apikeys`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apikey`;
  }

  update(id: number, updateApikeyDto: UpdateApikeyDto) {
    return `This action updates a #${id} apikey`;
  }

  remove(id: number) {
    return `This action removes a #${id} apikey`;
  }
}
