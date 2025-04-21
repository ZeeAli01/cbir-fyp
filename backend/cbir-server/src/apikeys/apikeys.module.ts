import { Module } from '@nestjs/common';
import { ApikeysService } from './apikeys.service';
import { ApikeysController } from './apikeys.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [ApikeysController],
    providers: [ApikeysService],
    exports: [ApikeysService]
})
export class ApikeysModule { }
