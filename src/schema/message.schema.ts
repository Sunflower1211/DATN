import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class Message extends Document {
    @Prop({ required: true, default: [] })
    sender: {avatar: string, login_name: string, id_login_name: string, userId: ObjectId}[];

    @Prop({ required: true, default: [] })
    receiver: {avatar: string, login_name: string, id_login_name: string, userId: ObjectId}[];

    @Prop()
    content_message: string; 

    @Prop()
    image: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);