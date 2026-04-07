import { ApiProperty } from '@nestjs/swagger'
import {
    IsDateString,
    IsNotEmpty,
    Matches,
    IsNumber,
    IsString,
    IsArray,
    ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'

export class PenjualanHarianDto {
    @ApiProperty({
        description: 'Tanggal pencarian dalam format YYYY-MM-DD',
        example: '2025-12-31'
    })
    @IsNotEmpty()
    @IsDateString()
    tanggal: string
}

export class PenjualanBulananDto {
    @ApiProperty({
        description: 'Bulan dan tahun dalam format YYYY-MM',
        example: '2026-01'
    })
    @IsNotEmpty()
    @Matches(/^\d{4}-\d{2}$/, {
        message: 'Format bulan harus YYYY-MM, contoh: 2026-01'
    })
    bulan: string
}

export class CreatePenjualanDto {
    @ApiProperty({
        description: 'Tipe pembayaran',
        example: 'cash'
    })
    @IsNotEmpty()
    tipePembayaran?: string

    @ApiProperty({
        description: 'Jumlah yang dibayar',
        example: 100000
    })
    @IsNotEmpty()
    paid: number
}
export class ItemCreatePenjualanDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    barangId: number

    @ApiProperty({ example: 2 })
    @IsNotEmpty()
    qty: number
}

