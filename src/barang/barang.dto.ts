import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { Decimal } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'

export class CreateBarangDto {
    @ApiProperty({ example: 'Indomie Goreng' })
    @IsNotEmpty()
    @IsString()
    nama: string

    @ApiProperty({ example: 'Mie instan rasa goreng', required: false })
    @IsOptional()
    @IsString()
    deskripsi?: string

    @ApiProperty({ example: 3000 })
    @IsNotEmpty()
    @IsNumber()
    hargaJual: Decimal

    @ApiProperty({ example: 2500 })
    @IsNotEmpty()
    @IsNumber()
    hargaBeli: Decimal

    @ApiProperty({ example: '8998888123456', required: false })
    @IsOptional()
    @IsString()
    barcode?: any

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    kategoriId: number
}

export class UpdateBarangDto {
    @ApiProperty({ example: 'Indomie Goreng' })
    @IsOptional()
    @IsString()
    nama?: string

    @ApiProperty({ example: 'Mie instan rasa goreng', required: false })
    @IsOptional()
    @IsString()
    deskripsi?: string

    @ApiProperty({ example: 3000 })
    @IsOptional()
    @IsNumber()
    hargaJual?: Decimal

    @ApiProperty({ example: 2500 })
    @IsOptional()
    @IsNumber()
    hargaBeli?: Decimal

    @ApiProperty({ example: '8998888123456', required: false })
    @IsOptional()
    @IsString()
    barcode?: string

    @ApiProperty({ example: 1 })
    @IsOptional()
    @IsNumber()
    kategoriId?: number
}

export class SearchQueryDto {
    @ApiProperty({
        example: 'indomie',
        required: false,
        default: ''
    })
    @IsOptional()
    @IsString()
    key?: string

    @ApiProperty({ example: 1, required: false, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number

    @ApiProperty({ example: 10, required: false, default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    num?: number
}

export class DetailStockOpnameDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    barangId: number

    @ApiProperty({ example: 100 })
    @IsNotEmpty()
    @IsNumber()
    countQty: number

    @ApiProperty({
        example: 'Stok fisik lebih banyak dari sistem',
        required: false
    })
    @IsOptional()
    @IsString()
    remark?: string
}

enum TypeStockOpname {
    koreksi = 'koreksi',
    penyesuaian = 'penyesuaian',
    initialQty = 'initialQty',
    qtyCounter = 'qtyCounter',
    scrap = 'scrap',
    transfer = 'transfer',
    expired = 'expired'
}

export class StockOpnameDto {
    @ApiProperty({ example: '2025-12-31' })
    @IsNotEmpty()
    @IsNumber()
    tanggal: Date

    @ApiProperty({ example: 'Koreksi stok', required: false })
    @IsOptional()
    @IsString()
    remark?: string

    @ApiProperty({ example: TypeStockOpname.koreksi })
    @IsNotEmpty()
    @IsString()
    type: TypeStockOpname

    @ApiProperty({ type: [DetailStockOpnameDto] })
    @IsNotEmpty()
    details: DetailStockOpnameDto[]
}
