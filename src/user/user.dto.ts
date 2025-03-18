import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
    @ApiProperty()
    username: string

    @ApiProperty()
    password: string
}

export class ChangePasswordDto {
    @ApiProperty()
    oldPassword: string

    @ApiProperty()
    newPassword: string

    @ApiProperty()
    confrimNewPassword: string
}

export class UserCreateParm {
    @ApiProperty()
    username: string

    @ApiProperty()
    password: string
    @ApiProperty()
    role?: string
}

export type UserProfile = {
    username: string
    role?: string
}
