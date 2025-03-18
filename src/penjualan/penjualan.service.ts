import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PenjualanService {
    constructor(private prisma: PrismaService) {}

    async create(data: any) {
        // return this.prisma.penjualan.create({
        //     data: {
        //         tanggal: data.tanggal,
        //         userId: data.userId,
        //         total: data.total,
        //         detailPenjualan: {
        //             create: data.detailPenjualan.map((detail) => ({
        //                 barangId: detail.barangId,
        //                 jumlah: detail.jumlah,
        //                 hargaSatuan: detail.hargaSatuan,
        //                 subtotal: detail.subtotal
        //             }))
        //         }
        //     },
        //     include: {
        //         detailPenjualan: true
        //     }
        // })
    }

    async findAll() {
        return this.prisma.penjualan.findMany({
            include: { detailPenjualan: true }
        })
    }

    async findOne(id: number) {
        return this.prisma.penjualan.findUnique({
            where: { id },
            include: { detailPenjualan: true }
        })
    }
}
