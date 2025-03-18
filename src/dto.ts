import { ApiProperty } from '@nestjs/swagger'

export class ResponseDto {
    status: string
    message?: string
    error?: string
    error_code?: string
    data?: any
}
