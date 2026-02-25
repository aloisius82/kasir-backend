import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from './roles.enum';

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

export class ResetPasswordDto {
    @ApiProperty()
    userId: number
}

export class ResponseDto {
    @ApiProperty()
    status: string

    @ApiProperty()
    message?: string

    @ApiProperty()
    data?: any

    @ApiProperty()
    error?: any
}

export class ChangeRoleDto {
  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
