import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    Query,
    UseGuards,
    Put
} from '@nestjs/common'
import {
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
    ApiBody,
    ApiQuery,
    ApiBearerAuth
} from '@nestjs/swagger'
import { AuthGuard } from '../auth/auth.guard'
import { SupplierService } from './supplier.service'
import { CreateSupplierDto } from './dto/create-supplier.dto'
import { UpdateSupplierDto } from './dto/update-supplier.dto'

@ApiTags('supplier')
@Controller('supplier')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new supplier' })
    @ApiBody({ type: CreateSupplierDto })
    @ApiResponse({
        status: 201,
        description: 'The supplier has been successfully created.'
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    create(@Body() createSupplierDto: CreateSupplierDto) {
        return this.supplierService.create(createSupplierDto)
    }

    @Get()
    @ApiOperation({ summary: 'Get all suppliers' })
    @ApiResponse({ status: 200, description: 'Return all suppliers.' })
    findAll() {
        return this.supplierService.findAll()
    }

    @Get('list')
    @ApiOperation({ summary: 'List suppliers with search and pagination' })
    @ApiQuery({
        name: 'search',
        required: false,
        type: String,
        description: 'Search by nama, telepon, pic, or picPhone'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)'
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page (default: 10)'
    })
    @ApiResponse({ status: 200, description: 'Return list of suppliers.' })
    list(
        @Query('search') search?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number
    ) {
        return this.supplierService.list(search, page, limit)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a supplier by ID' })
    @ApiParam({
        name: 'id',
        description: 'The ID of the supplier',
        type: Number
    })
    @ApiResponse({ status: 200, description: 'Return the supplier.' })
    @ApiResponse({ status: 404, description: 'Supplier not found.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.supplierService.findOne(id)
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a supplier by ID' })
    @ApiBody({ type: UpdateSupplierDto })
    @ApiParam({
        name: 'id',
        description: 'The ID of the supplier to update',
        type: Number
    })
    @ApiResponse({
        status: 200,
        description: 'The supplier has been successfully updated.'
    })
    @ApiResponse({ status: 404, description: 'Supplier not found.' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSupplierDto: UpdateSupplierDto
    ) {
        return this.supplierService.update(id, updateSupplierDto)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a supplier by ID' })
    @ApiParam({
        name: 'id',
        description: 'The ID of the supplier to delete',
        type: Number
    })
    @ApiResponse({
        status: 200,
        description: 'The supplier has been successfully deleted.'
    })
    @ApiResponse({ status: 404, description: 'Supplier not found.' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.supplierService.remove(id)
    }
}
