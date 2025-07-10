import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Code {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    code: number;


    @Prop({ type: Date, default: () => new Date(), expires: 60 * 5 })
    createdAt: Date;
}

export const CodeSchema = SchemaFactory.createForClass(Code);
