import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private user: Model<User>,
        private readonly jwtService: JwtService,
    ) {}

    async Login(account: string, password: string) {
        const user = await this.user.findOne({ account, password });
        if (user) {
            const token = this.jwtService.generateToken(user)
            return {
                message: 'token creation successfully',
                token,
            };
        } else {
            return {
                message: 'Not Found Request'
            };
        }
    }

    async Register (account: string, password: string) {

    }
}
