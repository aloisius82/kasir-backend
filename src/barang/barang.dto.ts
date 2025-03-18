import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { Decimal } from '@prisma/client/runtime/library'

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
    barcode?: string

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
