import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Types } from 'mongoose';

@Schema()
export class Post extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user_id: Types.ObjectId;

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    address: string;

    @Prop()
    salary: string;

}

export const PostSchema = SchemaFactory.createForClass(Post);