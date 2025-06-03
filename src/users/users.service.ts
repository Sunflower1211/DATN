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

    async editUser(account: string, user: any) {
        await this.user.updateOne({ account }, user);
    }

    async getSaveJob(account: string) {
        let result: object[] = [];
        const user = await this.user.findOne({ account }).populate('save_jobs').lean();
        const save_jobs = user?.save_jobs || [];
        for (let i = 0; i < save_jobs.length; i++) {
            const id = save_jobs[i].user_id;
            const user = await this.user.findById(id).lean();
            const save_job = { ...save_jobs[i], user };
            result.push(save_job);
        }
        return result;
    }

    async addSaveJob(account: string, id: string) {
        const save_job_id = new Types.ObjectId(id);
        await this.user.updateOne(
            { account },
            {
                $push: {
                    save_jobs: {
                        $each: [save_job_id],
                        $position: 0,
                    },
                },
            },
        );
    }

    async deleteSaveJob(account: string, id: string) {
        const save_job_id = new Types.ObjectId(id);
        console.log({ account, id });
        await this.user.updateOne({ account }, { $pull: { save_jobs: save_job_id } });
    }

    async deleteApplyJob(account: string, id: string) {
        const apply_job_id = new Types.ObjectId(id);
        await this.user.updateOne({ account }, { $pull: { apply_jobs: apply_job_id } });
    }

    async addFollow(account: string, data: any) {
        await this.user.updateOne({ account }, { $push: { follwing: data?.id } });
        await this.user.updateOne({ account: data?.account }, { $push: { followers: data?.id1 } });
    }

    async deleteFollow(account: string, data: any) {
        await this.user.updateOne({ account }, { $pull: { follwing: data.id } });
        await this.user.updateOne({ account: data?.account }, { $pull: { followers: data?.id1 } });
    }

    async getFollow(account: string) {
        const user = await this.user.findOne({ account });
        return user;
    }

    async getUser(id: string) {
        const user_id = new Types.ObjectId(id);
        return await this.user.findById(user_id);
    }

    async getComment(account: string) {
        const user = await this.user.findOne({ account }).lean();
        return user?.comment?.length ? user?.comment : [];
    }

    async addComment(account: string, content: string, star: number, account_comment: string) {
        const user_comment = await this.user.findOne({ account: account_comment }).lean();
        const user = await this.user.findOne({ account }).lean();
        const comment_old = user?.comment || [];
        const id = comment_old.length > 0 ? (comment_old[0]?.id + 1) : 1
        const comment = {
            login_name: user_comment?.login_name,
            user_id: user_comment?._id,
            content,
            updated_at: new Date(),
            star,
            id
        };
        await this.user.updateOne(
            { account },
            {
                $push: {
                    comment: {
                        $each: [comment],
                        $position: 0,
                    },
                },
            },
        );
    }

    async deleteComment(account: string, id: number) {
        await this.user.updateOne({ account }, { $pull: { comment: { id } } });
    }

    async editComment(account: string, data: any) {
        await this.user.updateOne({ account }, { $pull: { comment: { id: data?.id } } });
        const comment = {
            updated_at: new Date(),
            login_name: data?.author,
            star: data?.rating,
            id: data?.id,
            user_id: data?.user_id,
            content: data?.content
        }
        await this.user.updateOne(
            { account },
            {
                $push: {
                    comment: {
                        $each: [comment],
                        $position: 0,
                    },
                },
            },
        );
    }

    async getApplyJob(account: string) {
        let result: object[] = [];
        const user = await this.user.findOne({ account }).populate('apply_jobs').lean();
        const apply_jobs = user?.apply_jobs;
        for (let i = 0; i < apply_jobs.length; i++) {
            const id = apply_jobs[i].user_id;
            const user = await this.user.findById(id).lean();
            const apply_job = { ...apply_jobs[i], user };
            result.push(apply_job);
        }
        return result;
    }

    async editUserCompany(account: string, data: any) {
        const user = await this.user.findOne({ account });

        if (user?.role != 'company') {
            return {
                mes: 'Bạn phải là tài khoản công ty mới có thể cập nhật',
            };
        }
        await this.user.updateOne({ account }, data);
        return {
            mes: 'Cập nhật trang công ty thành công',
            user: await this.user.findOne({ account }),
        };
    }
}
