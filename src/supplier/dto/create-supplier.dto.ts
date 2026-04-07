import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateSupplierDto {
    @ApiProperty({
        example: 'PT. Sinar Jaya Abadi',
        description: 'Nama Supplier'
    })
    @IsString()
    @IsNotEmpty()
    nama: string

    @ApiPropertyOptional({
        example: 'Jl. Raya Industri No. 123, Jakarta',
        description: 'Alamat lengkap supplier'
    })
    @IsString()
    @IsOptional()
    alamat?: string

    @ApiPropertyOptional({
        example: '021-5551234',
        description: 'Nomor telepon kantor'
    })
    @IsString()
    @IsOptional()
    telepon?: string

    @ApiPropertyOptional({
        example: 'Budi Santoso',
        description: 'Nama Person in Charge (PIC)'
    })
    @IsString()
    @IsOptional()
    pic?: string

    @ApiPropertyOptional({
        example: '081234567890',
        description: 'Nomor HP PIC'
    })
    @IsString()
    @IsOptional()
    picPhone?: string
}
