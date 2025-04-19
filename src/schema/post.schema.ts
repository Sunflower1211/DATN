import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class Post extends Document {
    @Prop({ required: true, default: [] })
    user: {avatar: string, login_name: string, id_login_name: string, user_id: ObjectId}[];

    @Prop({ required: true })
    description: string;

    @Prop()
    address: string;

    @Prop()
    salary: string;

}

export const PostSchema = SchemaFactory.createForClass(Post);