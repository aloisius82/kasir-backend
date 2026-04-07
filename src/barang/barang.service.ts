import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBarangDto, SearchQueryDto, StockOpnameDto } from './barang.dto'

@Injectable()
export class BarangService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateBarangDto) {
        const dataBarang = Object.assign(
            {
                hargaBeliTerakhir: data.hargaBeli,
                hpp: data.hargaBeli,
                saleLokasiId: 1, // Default location
                kategoriId: 1, // Default kategori
                barcode: null
            },
            data
        )
        dataBarang.barcode = dataBarang.barcode?.trim()
        if (dataBarang.barcode === '' || dataBarang.barcode?.length === 0) {
            dataBarang.barcode = null
        }
        return this.prisma.barang.create({
            data: dataBarang,
            include: { kategori: true }
        })
    }

    async findAll({ q }: { q?: string }) {
        const where = {
            inactive: false,
            ...(q
                ? {
                      OR: [
                          {
                              nama: {
                                  contains: q
                                  // mode: 'insensitive'
                              }
                          },
                          {
                              barcode: {
                                  contains: q
                                  // mode: 'insensitive'
                              }
                          }
                      ]
                  }
                : {})
        }
        return this.prisma.barang.findMany({
            where,
            select: { id: true, nama: true, barcode: true, hargaJual: true }
        })
    }

    async search(query: SearchQueryDto) {
        const { key, page, num } = query
        const pageNumber = page || 1
        const itemsPerPage = num || 10
        const skip = (pageNumber - 1) * itemsPerPage
        const searchKey = key || ''

        const whereClause = {
            inactive: false,
            OR: [
                {
                    nama: {
                        contains: searchKey
                        // mode: 'insensitive'
                    }
                },
                {
                    barcode: {
                        contains: searchKey
                        // mode: 'insensitive'
                    }
                }
            ]
        }

        const [data, total] = await this.prisma.$transaction([
            this.prisma.barang.findMany({
                where: whereClause,
                skip: skip,
                take: Number(itemsPerPage)
            }),
            this.prisma.barang.count({ where: whereClause })
        ])

        const dataWithSaleQty = await Promise.all(
            data.map(async (item) => {
                const saleQty = await this.prisma.detailPenjualan.aggregate({
                    _sum: {
                        jumlah: true
                    },
                    where: {
                        barangId: item.id
                    }
                })
                return {
                    ...item,
                    saleQty: saleQty._sum.jumlah || 0
                }
            })
        )

        return {
            data: dataWithSaleQty,
            total,
            page: pageNumber,
            num: itemsPerPage,
            totalPages: Math.ceil(total / itemsPerPage)
        }
    }

    async findOne(id: number) {
        return this.prisma.barang.findFirst({ where: { id, inactive: false } })
    }

    async stockOpname(userId: number, data: StockOpnameDto) {
        // const barang = await this.prisma.barang.findUnique({
        //     where: { id }
        // })
        // if (!barang) {
        //     throw new NotFoundException('Barang tidak ditemukan')
        // }
        // const stokAwal = barang.stok
        // const { stokFisik, keterangan } = data
        // const selisih = stokFisik - stokAwal
        // return this.prisma.$transaction(async (prisma) => {
        //     await prisma.stockOpname.create({
        //         data: {
        //             barangId: id,
        //             stokAwal,
        //             stokAkhir: stokFisik,
        //             selisih,
        //             keterangan,
        //             userId
        //         }
        //     })
        //     return prisma.barang.update({
        //         where: { id },
        //         data: { stok: stokFisik }
        //     })
        // })
    }

    async update(id: number, data: any) {
        data.barcode = data.barcode?.trim()
        if (data.barcode === '' || data.barcode?.length === 0) {
            data.barcode = null
        }
        data.updatedAt = new Date()
        return this.prisma.barang.update({ where: { id }, data })
    }

    async remove(id: number) {
        // return this.prisma.barang.delete({ where: { id } })
        return this.prisma.barang.update({
            where: { id },
            data: { inactive: true }
        })
    }
}
