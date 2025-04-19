import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Post } from './post.schema';

@Schema()
export class User extends Document {
    @Prop({ required: true, unique: true })
    account: string;

    @Prop({required: true})
    password: string;

    @Prop({required: true})
    login_name: string;

    @Prop({ required: true, unique: true })
    id_login_name: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop({ required: false, unique: true }) //emai liên kết để lấy mk khi quên
    associated_email: string;

    @Prop({ required: false, unique: true })//SDT liên kết để lấy mk khi quên
    associated_phone: string;

    @Prop({required: true})
    role: string;

    @Prop({required: true})
    avatar: string;

    @Prop()
    address: string;

    @Prop()
    star: number;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Post'})
    save_jobs: Post[];

    @Prop({default: []})
    follwing: {avatar: string, login_name: string, id_login_name: string, user_id: ObjectId}[];

    @Prop({default: []})
    followers: {avatar: string, login_name: string, id_login_name: string, user_id: ObjectId}[];
}

export const UserSchema = SchemaFactory.createForClass(User);
