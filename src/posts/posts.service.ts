import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/schema/post.schema';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

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

    async findAll(account: string) {
        const record_posts = await this.post.find({ account }).sort({ created_at: -1 }).lean();
        const record_users = await this.user.findOne({ account }).lean();
        const result = record_posts.map(post => ({
            ...post,
            logo: record_users?.avatar || null,
            company: record_users?.account || null,
        }));
        return result;
    }

    findOne(id: number) {
        return `This action returns a #${id} post`;
    }

    update(id: number, updatePostDto: UpdatePostDto) {
        return `This action updates a #${id} post`;
    }

    remove(id: number) {
        return `This action removes a #${id} post`;
    }
}
