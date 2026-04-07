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
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { Role } from '../user/roles.enum'
import {
    CreateBarangDto,
    UpdateBarangDto,
    SearchQueryDto,
    StockOpnameDto
} from './barang.dto'

@Controller('barang')
@ApiTags('barang')
export class BarangController {
    constructor(private readonly barangService: BarangService) {}

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles([Role.admin, Role.kasir])
    @ApiBearerAuth()
    create(@Body() data: CreateBarangDto, @Request() req) {
        return this.barangService.create(data)
    }

    @Get()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiQuery({
        name: 'q',
        required: false,
        type: String,
        description: 'Kata kunci pencarian'
    })
    findAll(@Request() req, @Query('q') q?: string) {
        return this.barangService.findAll({ q })
    }

    @Get('list')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Mencari barang berdasarkan kata kunci dengan paginasi'
    })
    @ApiQuery({
        name: 'key',
        required: false,
        type: String,
        description: 'Kata kunci pencarian (nama atau barcode)'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Nomor halaman'
    })
    @ApiQuery({
        name: 'num',
        required: false,
        type: Number,
        description: 'Jumlah item per halaman'
    })
    list(@Query() query: SearchQueryDto) {
        return this.barangService.search(query)
    }

    @Get('search')
    @ApiOperation({
        summary: 'Mencari barang berdasarkan kata kunci dengan paginasi'
    })
    @ApiQuery({
        name: 'key',
        required: false,
        type: String,
        description: 'Kata kunci pencarian (nama atau barcode)'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Nomor halaman'
    })
    @ApiQuery({
        name: 'num',
        required: false,
        type: Number,
        description: 'Jumlah item per halaman'
    })
    search(@Query() query: SearchQueryDto) {
        return this.barangService.search(query)
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.barangService.findOne(id)
    }

    @Post('stock-opname')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles([Role.admin, Role.kasir])
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Melakukan stock opname untuk barang' })
    async stockOpname(@Body() data: StockOpnameDto, @Request() req) {
        if (!req.user || !req.user.id) {
            throw new HttpException(
                'User not found in request',
                HttpStatus.UNAUTHORIZED
            )
        }
        try {
            return await this.barangService.stockOpname(req.user.id, data)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    @Put(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles([Role.admin, Role.kasir])
    @ApiBearerAuth()
    update(
        @Param('id', ParseIntPipe) id: any,
        @Body() data: UpdateBarangDto,
        @Request() req
    ) {
        // console.log('update barang', id, data)
        return this.barangService.update(id, data)
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles([Role.admin, Role.kasir])
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Menghapus barang berdasarkan ID' })
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.barangService.remove(id)
    }
}
