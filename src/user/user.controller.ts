import {
    Controller,
    Get,
    Post,
    Body,
    Request,
    UseGuards,
    HttpException,
    HttpStatus,
    Patch,
    Param
} from '@nestjs/common'
import { ApiTags, ApiProperty, ApiBearerAuth } from '@nestjs/swagger'
import { UserService } from './user.service'
import {
    LoginDto,
    ChangePasswordDto,
    UserCreateParm,
    ResetPasswordDto,
    ChangeRoleDto
} from './user.dto'
import { AuthGuard } from '../auth/auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { Role } from './roles.enum'

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/login')
    async userLoging(@Body() data: LoginDto): Promise<any> {
        // return data
        return this.userService.login(data.username, data.password)
    }

    @Post('create')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    createUser(@Body() data: UserCreateParm, @Request() req) {
        if (req.user.role != 'admin')
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
        return this.userService.createUser(data)
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/profile')
    async getProfile(@Request() req): Promise<any> {
        return this.userService.getProfile(req.user.sub)
    }

    @Post('/change-password')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async changePassword(@Body() parm: ChangePasswordDto, @Request() req) {
        // console.log(parm, req.user)
        if (parm.newPassword != parm.confrimNewPassword)
            throw new HttpException(
                'not match new password',
                HttpStatus.NOT_ACCEPTABLE
            )
        // console.log('log 1')
        return this.userService.changePassword(
            req.user.sub,
            parm.oldPassword,
            parm.newPassword,
            req.user
        )
    }

    @Patch(':id/role')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.admin)
    @ApiBearerAuth()
    async changeRole(
        @Param('id') id: number,
        @Body() changeRoleDto: ChangeRoleDto
    ) {
        return this.userService.changeRole(+id, changeRoleDto.role)
    }

    @Get('/renew-token')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async renewToken(@Request() req): Promise<any> {
        return this.userService.renewToken(req.user.sub)
    }

    @Get('/user/list')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async userList(@Request() req): Promise<any> {
        return this.userService.userList(req.user, {})
    }

    @Post('/user/reset-password')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.admin)
    @ApiBearerAuth()
    async resetPassword(@Body() parm: ResetPasswordDto, @Request() req) {
        return this.userService.resetPassword(parm.userId, req.user)
    }
}
