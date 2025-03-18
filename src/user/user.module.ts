import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { ConfigModule } from '@nestjs/config'
import { AuthService } from '../auth/auth.service'

@Module({
    imports: [PrismaModule, ConfigModule],
    providers: [UserService, AuthService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
