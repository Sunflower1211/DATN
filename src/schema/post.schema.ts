import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Post extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user_id: Types.ObjectId;

    @Prop()
    account: string;

    @Prop()
    title: string;

    @Prop({ default: '' })
    exp: string;

    //mô tả công việc
    @Prop({ default: '' })
    description: string;

    //yêu cầu ứng viên
    @Prop({ default: '' })
    candidate_requirement: string;

    //quyền lợi
    @Prop({ default: '' })
    interest: string;

    @Prop()
    address: string;

    @Prop()
    salary: string;

    @Prop()
    updated_at: Date;

    @Prop()
    created_at: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);