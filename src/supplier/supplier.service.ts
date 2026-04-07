import { Injectable } from '@nestjs/common'
import { CreateSupplierDto } from './dto/create-supplier.dto'
import { UpdateSupplierDto } from './dto/update-supplier.dto'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SupplierService {
    constructor(private prisma: PrismaService) {}

    create(createSupplierDto: CreateSupplierDto) {
        return this.prisma.supplier.create({
            data: createSupplierDto
        })
    }

    findAll() {
        return this.prisma.supplier.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    async list(search?: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit
        const where = search
            ? {
                  OR: [
                      { nama: { contains: search } },
                      { telepon: { contains: search } },
                      { pic: { contains: search } },
                      { picPhone: { contains: search } }
                  ]
              }
            : undefined

        const [data, total] = await this.prisma.$transaction([
            this.prisma.supplier.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.supplier.count({ where })
        ])

        return {
            data,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit)
        }
    }

    findOne(id: number) {
        return this.prisma.supplier.findUnique({
            where: { id },
            include: {
                order: true // Opsional: sertakan riwayat order jika diperlukan
            }
        })
    }

    update(id: number, updateSupplierDto: UpdateSupplierDto) {
        return this.prisma.supplier.update({
            where: { id },
            data: {
                nama: updateSupplierDto.nama,
                telepon: updateSupplierDto.telepon,
                alamat: updateSupplierDto.alamat,
                pic: updateSupplierDto.pic,
                picPhone: updateSupplierDto.picPhone,
                updatedAt: new Date()
            }
        })
    }

    remove(id: number) {
        return this.prisma.supplier.delete({
            where: { id }
        })
    }
}
