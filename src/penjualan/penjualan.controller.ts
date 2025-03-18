import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
    UseGuards
} from '@nestjs/common'
import { PenjualanService } from './penjualan.service'
// import { AuthGuard } from '@nestjs/passport'
import { AuthGuard } from '../auth/auth.guard'

@Controller('penjualan')
@UseGuards(AuthGuard)
export class PenjualanController {
    constructor(private readonly penjualanService: PenjualanService) {}

    @Post()
    create(@Body() data: any) {
        return this.penjualanService.create(data)
    }

    @Get()
    findAll() {
        return this.penjualanService.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.penjualanService.findOne(id)
    }
}
