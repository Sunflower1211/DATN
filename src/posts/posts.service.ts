import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/schema/post.schema';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

interface user_interface {
    avatar?: string;
    login_name?: string;
}

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private post: Model<Post>,
        @InjectModel(User.name) private user: Model<User>,
    ) {}

    async create(createPostDto: CreatePostDto, account: string) {
        const user_id = new Types.ObjectId(createPostDto.user_id);

        const record_post = await this.post.create({ ...createPostDto, user_id, account });

        if (record_post) {
            const user = await this.user.findOne({ account });
            for (const element of user?.followers || []) {
                const follower_id = new Types.ObjectId(element);
                const follower = await this.user.findOne({ _id: follower_id });
                if (follower) {
                    await this.MailerService.sendMail({
                        to: follower.email,
                        subject: 'Thông báo từ Tìm việc 24/7',
                        html: `
                            <div>
                                <p>Hi ${follower.login_name},</p>
                                <p>Công ty: ${user?.company || ''}.</p>
                                <p>Đã có một bài viết mới được tạo: ${record_post.title}.</p>
                            </div>
                        `,
                    });
                }
            }
            return {
                status_code: 201,
                message: 'create post success',
            };
        } else {
            return {
                message: 'create post fail',
            };
        }
    }

    async editPost(post: any, account: string) {
        const record_post = await this.post.updateOne({ _id: post._id }, post);
    }

    async findAll() {
        const record_posts = await this.post.find().sort({ updated_at: -1 }).populate('user_id').lean();
        const result = record_posts.map(post => {
            const user = post.user_id as user_interface;
            return {
                ...post,
                logo: user?.avatar || null,
                company: user?.login_name || null,
            };
        });
        return result;
    }

    async findAllPostUser(account: string) {
        let record_posts = await this.post.find({ account }).sort({ updated_at: -1 }).populate('user_id').lean();
        const result = record_posts.map(post => {
            const user = post.user_id as user_interface;
            return {
                ...post,
                logo: user?.avatar || null,
                company: user?.login_name || null,
            };
        });
        return result;
    }

    async findOne(id: string) {
        const post_id = new Types.ObjectId(id);
        return await this.post.findById(post_id).populate('user_id');
    }

    async update(updatePostDto: UpdatePostDto, id: string) {
        return '';
    }

    async remove(id: string) {
        const post_id = new Types.ObjectId(id);
        console.log('post_id: ', post_id);
        const deletedPost = await this.post.findByIdAndDelete(post_id);
        console.log('deletedPost: ', deletedPost);

        if (deletedPost) {
            return {
                status_code: 200,
                message: 'xóa post thành công',
            };
        } else {
            return {
                message: 'xóa post thất bại',
            };
        }
    }
}
