import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthService } from '../auth/auth.service'
import * as bcrypt from 'bcryptjs'
import { UserCreateParm } from './user.dto'
import { ResponseDto } from '../dto'

export type User = any

// export type User

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private auth: AuthService
    ) {}

    async findOne(username: string): Promise<User | null> {
        return await this.prisma.user.findUnique({ where: { username } })
    }

    async login(username: string, paasword: string): Promise<any> {
        return this.auth.authUser(username, paasword)
    }

    async renewToken(userId: number): Promise<any> {
        return this.auth.renewToken(userId)
    }

    async getProfile(userId: number): Promise<any> {
        return await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true, role: true }
        })
    }

    async changePassword(
        userId: number,
        oldPassword: string,
        newPassword: string
    ): Promise<any | null> {
        return this.auth.changePassword(userId, oldPassword, newPassword)
    }

    async createUser(data: UserCreateParm): Promise<ResponseDto | null> {
        const hashedPassword = await bcrypt.hash(data.password, 10)
        if (!data.role) {
            data.role = 'user'
        }
        const user = await this.prisma.user.findUnique({
            where: { username: data.username }
        })
        if (user)
            throw new HttpException(
                'user already exist',
                HttpStatus.NOT_ACCEPTABLE
            )
        try {
            await this.prisma.user.create({
                data: {
                    username: data.username,
                    role: data.role,
                    password: await this.auth.hashedPass(data.password)
                }
            })
            return { status: 'ok' }
        } catch (error) {
            throw new HttpException(
                'something error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}
