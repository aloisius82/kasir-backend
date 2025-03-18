import {
    Controller,
    Get,
    Post,
    Body,
    Request,
    UseGuards,
    HttpException,
    HttpStatus
} from '@nestjs/common'
import { ApiTags, ApiProperty, ApiBearerAuth } from '@nestjs/swagger'
import { UserService } from './user.service'
import { LoginDto, ChangePasswordDto, UserCreateParm } from './user.dto'
import { AuthGuard } from '../auth/auth.guard'

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
        if (parm.newPassword != parm.confrimNewPassword)
            throw new HttpException(
                'not match new password',
                HttpStatus.UNAUTHORIZED
            )
        return this.userService.changePassword(
            req.user.sub,
            parm.oldPassword,
            parm.newPassword
        )
    }

    @Get('/renew-token')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async renewToken(@Request() req): Promise<any> {
        return this.userService.renewToken(req.user.sub)
    }
}
