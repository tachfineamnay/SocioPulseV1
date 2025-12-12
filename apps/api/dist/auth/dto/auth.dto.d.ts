import { UserRole } from '@lesextras/types';
export { UserRole } from '@lesextras/types';
export declare class RegisterDto {
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        role: UserRole;
        status: string;
    };
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
