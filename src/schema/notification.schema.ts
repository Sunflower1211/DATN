import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class Notification extends Document {
    @Prop({ required: true })
    transfer_link: string;

    @Prop({ required: true })
    user: {avatar: string, login_name: string, id_login_name: string, user_id: ObjectId}[];

    @Prop({ required: true })
    content_notification: string;

    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    type_notification: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);