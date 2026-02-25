import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from '../prisma/prisma.module'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
    imports: [
        PrismaModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '8h' }
            }),
            inject: [ConfigService],
            global: true
        })
    ],
    providers: [AuthService],
    controllers: [],
    exports: [AuthService]
})
export class AuthModule {}
