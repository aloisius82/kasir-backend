import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { BarangModule } from './barang/barang.module'
import { PenjualanModule } from './penjualan/penjualan.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { SupplierModule } from './supplier/supplier.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath:
                process.env.NODE_ENV === 'production'
                    ? '.env.production'
                    : '.env'
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'public')
        }),
        EventEmitterModule.forRoot(),
        UserModule,
        AuthModule,
        PrismaModule,
        BarangModule,
        PenjualanModule,
        SupplierModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
