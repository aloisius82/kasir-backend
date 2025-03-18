import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { BarangModule } from './barang/barang.module';
import { PenjualanModule } from './penjualan/penjualan.module';

@Module({
    imports: [UserModule, AuthModule, PrismaModule, BarangModule, PenjualanModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
