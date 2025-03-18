import { Module } from '@nestjs/common'
import { BarangService } from './barang.service'
import { BarangController } from './barang.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { AuthService } from '../auth/auth.service'

@Module({
    imports: [PrismaModule],
    providers: [BarangService, AuthService],
    controllers: [BarangController]
})
export class BarangModule {}
