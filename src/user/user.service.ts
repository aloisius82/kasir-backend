import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthService } from '../auth/auth.service'
import * as bcrypt from 'bcryptjs'
import { UserCreateParm } from './user.dto'
import { ResponseDto } from '../dto'
import { Role } from './roles.enum'

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

    async login(username: string, password: string): Promise<any> {
        return this.auth.authUser(username, password)
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
        newPassword: string,
        requestingUser: any
    ): Promise<any | null> {
        if (requestingUser == null)
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
        if (requestingUser.sub !== userId)
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
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

    async userList(
        requestingUser: any,
        opt?: { userId?: number; role?: string }
    ): Promise<any> {
        if (requestingUser == null)
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
        if (requestingUser.role != 'admin')
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
        const whereClause: any = {}
        if (opt?.userId) whereClause.id = opt.userId
        if (opt?.role) whereClause.role = opt.role
        return this.prisma.user.findMany({
            where: whereClause,
            select: { id: true, username: true, role: true }
        })
    }

    async resetPassword(
        userId: number,
        requestingUser: any
    ): Promise<ResponseDto | null> {
        if (requestingUser == null)
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
        if (requestingUser.role != 'admin')
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
        const defaultPassword = 'password123'
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        })
        if (!user)
            throw new HttpException('user not found', HttpStatus.NOT_FOUND)
        try {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    password: await this.auth.hashedPass(defaultPassword)
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

    async changeRole(userId: number, role: Role): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        })
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: { role }
        })
    }
}
