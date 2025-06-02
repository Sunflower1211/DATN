import { Controller, Post, UploadedFile, UseInterceptors, Body, Get, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('apply')
export class ApplyController {
    constructor(private readonly mailerService: MailerService) {}
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
        @Body() body: { name: string; email: string; phone: string; intro?: string; to: any },
    ) {
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

    @Post('upload-image')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/image',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
            limits: { fileSize: 2 * 1024 * 1024 }, // Giới hạn 2MB cho ảnh
            fileFilter: (req, file, cb) => {
                const ext = extname(file.originalname).toLowerCase();
                if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                    cb(null, true);
                } else {
                    cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
                }
            },
        }),
    )
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() body: { name: string; email: string }) {
        console.log('Ảnh uploaded:', file);
        console.log('Form data:', body);

        return {
            message: 'Upload ảnh thành công',
            file: file,
            data: body,
        };
    }
}
