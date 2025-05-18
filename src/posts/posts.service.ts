import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/schema/post.schema';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

@Injectable()
export class PostsService {
    constructor(@InjectModel(Post.name) private post: Model<Post>) {}

    async create(createPostDto: CreatePostDto) {
        const user_id = new Types.ObjectId(createPostDto.user_id);

        const record_post = await this.post.create({ ...createPostDto, user_id });
        
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

    findAll() {
        return `This action returns all posts`;
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
