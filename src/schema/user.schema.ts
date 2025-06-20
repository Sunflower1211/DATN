import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Post } from './post.schema';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User extends Document {
    @Prop({ required: true, unique: true })
    account: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    login_name: string;

    @Prop({ default: '' })
    email: string;

    @Prop({ default: '' })
    phone: string;

    @Prop({ unique: true }) //emai liên kết để lấy mk khi quên
    associated_email: string;

    @Prop({ unique: true }) //SDT liên kết để lấy mk khi quên
    associated_phone: string;

    @Prop({ default: 'user' })
    role: string;

    @Prop({ default: '' })
    avatar: string;

    @Prop({ default: '' })
    address: string;

    @Prop()
    description: string;

    @Prop({ default: 5 })
    star: number;

    @Prop({ default: '' })
    sex: string;

    //lĩnh vực
    @Prop({ default: '' })
    field: string;

    //quy mô
    @Prop({ default: '' })
    scale: string;

    @Prop({ default: '' })
    web: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
    save_jobs: Post[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
    apply_jobs: Post[];

    @Prop({ default: [] })
    follwing: string[];

    @Prop({ default: [] })
    followers: string[];

    @Prop({ default: [] })
    comment: { login_name: string; user_id: ObjectId; content: string; updated_at: Date; star: number; id: number }[];

    @Prop()
    updated_at: Date;

    @Prop()
    created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
