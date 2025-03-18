import { Module } from '@nestjs/common'
import { PenjualanService } from './penjualan.service'
import { PenjualanController } from './penjualan.controller'
import { AuthService } from '../auth/auth.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    providers: [PenjualanService, AuthService],
    controllers: [PenjualanController]
})
export class PenjualanModule {}
