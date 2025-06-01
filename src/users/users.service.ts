import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
            const token = this.jwtService.generateToken({ account, user_id: user?._id });
            return {
                status: 200,
                message: 'token creation successfully',
                token,
            };
        } else {
            return {
                message: 'Not Found Request',
            };
        }
    }

    async Register(account: string, password: string, login_name: string, email: string) {
        const user = await this.user.findOne({ account });
        const user1 = await this.user.findOne({ login_name });
        if (user) {
            return {
                message: 'account',
            };
        } else if (user1) {
            return {
                message: 'login_name',
            };
        } else {
            await this.user.create({ account, password, login_name, email });
            return {
                message: 'register success',
                status: 200,
            };
        }
    }

    async infoUser(token: string) {
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

    async getSaveJob(account: string) {
        const user = await this.user.findOne({ account }).populate('save_jobs');
        return user?.save_jobs ? user?.save_jobs : [];
    }

    async addSaveJob(account: string, id: string) {
        const save_job_id = new Types.ObjectId(id);
        await this.user.updateOne({ account }, { $push: { save_jobs: save_job_id } });
    }

    async deleteSaveJob(account: string, id: string) {
        const save_job_id = new Types.ObjectId(id);
        await this.user.updateOne({ account }, { $pull: { save_jobs: save_job_id } });
    }

    async addFollow(account: string, id: string) {
        await this.user.updateOne({ account }, { $push: { followers: id } });
    }

    async deleteFollow(account: string, id: string) {
        await this.user.updateOne({ account }, { $pull: { followers: id } });
    }

    async getFollow(account: string) {
        const user = await this.user.findOne({ account }).populate('followers');
        return user?.followers ? user?.followers : [];
    }

    async getUser(id: string) {
        const user_id = new Types.ObjectId(id);
        return await this.user.findById(user_id);
    }
}
