import {
    Injectable,
    NotFoundException,
    HttpException,
    HttpStatus
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private prisma: PrismaService
    ) {}

    async findOne(username: string): Promise<any | null> {
        return await this.prisma.user.findUnique({ where: { username } })
    }

    async authUser(
        username: string,
        password: string
    ): Promise<{ access_token: string; username: string } | null> {
        const user = await this.findOne(username)
        if (user == null)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        if (!(await bcrypt.compare(password, user.password)))
            // if (user.paasword != hashedPassword)
            throw new HttpException(
                'User and Password not match',
                HttpStatus.BAD_REQUEST
            )

        const payload = { sub: user.id, role: user.role }
        const access_token = await this.jwtService.signAsync(payload)
        return {
            access_token,
            username
        }
    }

    async validatePassword(
        username: string,
        password: string
    ): Promise<boolean> {
        const user = await this.findOne(username)
        return await bcrypt.compare(password, user.password)
    }

    async changePassword(
        userId: number,
        oldPassword: string,
        newPassword: string
    ): Promise<{ status: string }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        })
        if (!user) throw new HttpException('not found', HttpStatus.NOT_FOUND)
        if (!bcrypt.compare(oldPassword, user.password))
            throw new HttpException(
                'password not match',
                HttpStatus.UNAUTHORIZED
            )
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        })
        return { status: 'ok' }
    }

    async renewToken(userId: number): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        })
        if (!user) throw new HttpException('not found', HttpStatus.UNAUTHORIZED)
        const payload = { sub: user.id, role: user.role }
        const access_token = await this.jwtService.signAsync(payload)
        return {
            access_token
        }
        return null
    }

    async verifyToken(token: string): Promise<any> {
        return await this.jwtService.verifyAsync(token)
    }

    async hashedPass(password: string): Promise<string> {
        return await bcrypt.hash(password, 10)
    }
}
