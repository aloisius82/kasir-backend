import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    ParseIntPipe,
    Request,
    UseGuards,
    HttpException,
    HttpStatus,
    Query
} from '@nestjs/common'
import {
    ApiTags,
    ApiProperty,
    ApiBearerAuth,
    ApiQuery,
    ApiOperation
} from '@nestjs/swagger'
import { BarangService } from './barang.service'
// import { AuthGuard } from '@nestjs/passport'
import { AuthGuard, AuthAdminGuard } from '../auth/auth.guard'
import { CreateBarangDto, UpdateBarangDto } from './barang.dto'

@Controller('barang')
@ApiTags('barang')
export class BarangController {
    constructor(private readonly barangService: BarangService) {}

    @Post()
    @UseGuards(AuthAdminGuard)
    create(@Body() data: CreateBarangDto, @Request() req) {
        return this.barangService.create(data)
    }

    @Get()
    @UseGuards(AuthGuard)
    findAll(@Request() req) {
        return this.barangService.findAll()
    }

    @Get('search')
    @ApiOperation({ summary: 'Mencari barang berdasarkan kata kunci' }) // Menambahkan deskripsi operasi
    @ApiQuery({
        name: 'key',
        required: true,
        type: String,
        description: 'Kata kunci pencarian'
    }) // Menambahkan deskripsi parameter
    search(@Query('key') key: string) {
        return this.barangService.search(key)
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.barangService.findOne(id)
    }

    @Put(':id')
    @UseGuards(AuthAdminGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateBarangDto,
        @Request() req
    ) {
        return this.barangService.update(id, data)
    }

    @Delete(':id')
    @UseGuards(AuthAdminGuard)
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.barangService.remove(id)
    }
}
