import { Controller, Post, UploadedFile, UseInterceptors, Body, Get, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Controller('apply')
export class ApplyController {
    constructor(
        private readonly mailerService: MailerService,
        @InjectModel(User.name) private user: Model<User>,
    ) {}
    @Post('upload-file')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/cv',
                filename: (req, file, cb) => {
                    console.log({ file });
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
            limits: { fileSize: 5 * 1024 * 1024 },
            fileFilter: (req, file, cb) => {
                if (['.pdf', '.doc', '.docx'].includes(extname(file.originalname).toLowerCase())) {
                    cb(null, true);
                } else {
                    cb(new Error('Only .pdf, .doc, .docx files are allowed'), false);
                }
            },
        }),
    )
    async handleUpload(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: { name: string; email: string; phone: string; intro?: string; to: any; id: string },
        @Request() req: any,
    ) {
        const apply_job_id = new Types.ObjectId(body?.id);
        await this.user.updateOne(
            { account: req?.user?.account },
            {
                $addToSet: {
                    apply_jobs: {
                        $each: [apply_job_id],
                    },
                },
            },
        );

        await this.mailerService.sendMail({
            to: body.to,
            subject: 'Tìm việc 24/7',
            html: `
            <div>Họ và tên: ${body.name}</div>
            <div>Email: ${body.email}</div>
            <div>Số điện thoại: ${body.phone}</div>
            ${body?.intro && `<div>Giới thiệu: ${body.intro}</div>`}
            `,
            attachments: [
                {
                    filename: file.filename,
                    path: file.path,
                },
            ],
        });

        return {
            message: 'Upload thành công',
            data: body,
        };
    }
}
