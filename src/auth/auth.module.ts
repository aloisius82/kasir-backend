import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { PrismaModule } from '../prisma/prisma.module'

console.log(jwtConstants.secret)

@Module({
    imports: [
        // UsersModule,
        PrismaModule,
        JwtModule.register({
            global: true,
            secret: 'coba ini',
            signOptions: { expiresIn: '1h' }
        })
    ],
    providers: [AuthService],
    controllers: [],
    exports: [AuthService]
})
export class AuthModule {}
