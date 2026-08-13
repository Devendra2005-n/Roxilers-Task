import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("../users/entities/user.entity").UserRole;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
        };
    }>;
    logout(): Promise<{
        message: string;
    }>;
    updatePassword(req: any, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
}
