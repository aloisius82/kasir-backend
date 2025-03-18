import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class BarangService {
    constructor(private prisma: PrismaService) {}

    async create(data: any) {
        return this.prisma.barang.create({ data })
    }

    async findAll() {
        return this.prisma.barang.findMany()
    }

    async search(key: string): Promise<any> {
        return await this.prisma.barang.findMany({
            where: { nama: { search: key } }
        })
    }

    async findOne(id: number) {
        return this.prisma.barang.findUnique({ where: { id } })
    }

    async update(id: number, data: any) {
        return this.prisma.barang.update({ where: { id }, data })
    }

    async remove(id: number) {
        return this.prisma.barang.delete({ where: { id } })
    }
}
