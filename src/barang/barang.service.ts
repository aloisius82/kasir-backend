import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBarangDto, SearchQueryDto } from './barang.dto'
import { contains } from 'class-validator'

@Injectable()
export class BarangService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateBarangDto) {
        const dataBarang = Object.assign(
            {
                hargaBeliTerakhir: data.hargaBeli,
                hpp: data.hargaBeli,
                saleLokasiId: 1, // Default location
                kategoriId: 1 // Default kategori
            },
            data
        )
        return this.prisma.barang.create({
            data: dataBarang,
            include: { kategori: true }
        })
    }

    async findAll({ q }: { q?: string }) {
        const where = q
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
            : undefined
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

        return {
            data,
            total,
            page: pageNumber,
            num: itemsPerPage,
            totalPages: Math.ceil(total / itemsPerPage)
        }
    }

    async findOne(id: number) {
        return this.prisma.barang.findUnique({ where: { id } })
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
        return this.prisma.barang.delete({ where: { id } })
    }
}
