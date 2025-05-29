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

    async findAll() {
        const record_posts = await this.post.find().sort({ created_at: -1 }).populate('user_id').lean();
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
        const record_posts = await this.post.find({ account }).sort({ created_at: -1 }).populate('user_id').lean();
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

    findOne(id: string) {
        return `This action returns a #${id} post`;
    }

    async update(updatePostDto: UpdatePostDto, id: string) {
        return '';
    }

    async remove(id: string) {
        const post_id = new Types.ObjectId(id);
        console.log('post_id: ', post_id);
        const deletedPost = await this.post.findByIdAndDelete(post_id );
        console.log('deletedPost: ', deletedPost)

        if (deletedPost) {
            return {
                status_code: 200,
                message: 'xóa post thành công'
            }
        } else {
            return {
                message: 'xóa post thất bại'
            }
        }
    }
}
