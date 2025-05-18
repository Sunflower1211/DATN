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
            const token = this.jwtService.generateToken({ account, user_id: user?._id })
            return {
                status: 200,
                message: 'token creation successfully',
                token,
            };
        } else {
            return {
                message: 'Not Found Request'
            };
        }
    }

    async Register (account: string, password: string, login_name: string) {
        const user = await this.user.findOne({ account });
        const user1 = await this.user.findOne({ login_name });
        if(user){
            return {
                message: 'account',
            }
        }else if(user1) {
            return {
                message: 'login_name',
            }
        } 
        else{
            await this.user.create({account, password, login_name})
            return {
                message: 'register success',
                status: 200
            }
        }
    }

    async infoUser (token: string) {
        const data = await this.jwtService.verifyToken(token);

        const user = await this.user.findOne({ account: data?.account });

        if (user) {
            return {
                user,
                status: 200,
                message: 'success',
            };
        } else {
            return {
                message: 'fail',
            };
        }
    }

}
