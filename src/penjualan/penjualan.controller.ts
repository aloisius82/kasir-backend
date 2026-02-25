import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
    Req,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { PenjualanService } from './penjualan.service';
// import { AuthGuard } from '@nestjs/passport'
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiProperty, ApiBearerAuth } from '@nestjs/swagger';
import { PenjualanHarianDto, PenjualanBulananDto } from './penjualan.dto';

@Controller('penjualan')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PenjualanController {
    constructor(private readonly penjualanService: PenjualanService) {}

    @Post()
    create(@Body() data: any, @Req() req) {
        // console.log(req.user);
        return this.penjualanService.create(data, req.user);
    }

    @Get('/harian')
    getTransaksiHarian(
        @Query(new ValidationPipe({ transform: true }))
        query: PenjualanHarianDto,
    ) {
        return this.penjualanService.getTransaksiHarian(query.tanggal);
    }

    @Get('/bulanan/per-barang')
    getPenjualanBulanan(
        @Query(new ValidationPipe({ transform: true }))
        query: PenjualanBulananDto,
    ) {
        return this.penjualanService.getPenjualanBulananPerBarang(query.bulan);
    }

    @Get()
    findAll() {
        return this.penjualanService.findAll();
    }

    @Get('report/daily-items')
    getDailyItemReport(@Query('date') date?: string) {
        return this.penjualanService.getDailyItemReport(date);
    }

    @Get('report/daily-sales')
    getDailySalesReport(@Query('date') date?: string) {
        return this.penjualanService.getDailySalesReport(date);
    }

    @Get('last7days')
    findLast7Days() {
        return this.penjualanService.findLast7Days();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.penjualanService.findOne(id);
    }

    @Post('print/receipt')
    print(@Body() data: any, @Req() req) {
        return this.penjualanService.generateReceipt({ harga: 10000 }, req.user);
    }
}
