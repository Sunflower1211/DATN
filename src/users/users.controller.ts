import { Body, Controller, Get, Param, Post, Query, Request, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UsersController {
    constructor(private service: UsersService) {}

    @Post('/login')
    async Login(@Body(new ValidationPipe()) data: LoginDto) {
        return this.service.Login(data.account, data.password);
    }

    @Post('/register')
    async Register(@Body() data: any) {
        return this.service.Register(data.account, data.password, data.login_name, data?.email);
    }

    @Get('/info-user')
    async infoUser(@Query('token') token: string) {
        return this.service.infoUser(token);
    }

    @Get('/get-user/:id')
    async getUser(@Param('id') id: string) {
        return await this.service.getUser(id);
    }

    @Post('/edit-user')
    async editUser(@Request() req: any, @Body() data: any) {
        await this.service.editUser(req?.user?.account, data);
        return true;
    }

    @Get('get-apply-job')
    async getApplyJob(@Request() req: any) {
        return await this.service.getApplyJob(req?.user?.account);
    }

    @Post('delete-apply-job')
    async deleteApplyJob(@Request() req: any, @Body() data: any) {
        await this.service.deleteApplyJob(req?.user?.account, data?.id);
        return true;
    }

    @Get('get-save-job')
    async getSaveJob(@Request() req: any) {
        return await this.service.getSaveJob(req?.user?.account);
    }

    @Post('add-save-job')
    async addSaveJob(@Request() req: any, @Body() data: any) {
        await this.service.addSaveJob(req?.user?.account, data?.id);
        return true;
    }

    @Post('delete-save-job')
    async deleteSaveJob(@Request() req: any, @Body() data: any) {
        await this.service.deleteSaveJob(req?.user?.account, data?.id);
        return true;
    }

    @Get('get-follow')
    async getFollow(@Request() req: any, @Query('account') account: string) {
        if (!account) {
            account = req?.user?.account;
        }
        return await this.service.getFollow(account);
    }

    @Post('add-follow')
    async addFollow(@Request() req: any, @Body() data: any) {
        await this.service.addFollow(req?.user?.account, data);
        return true;
    }

    @Post('delete-follow')
    async deleteFollow(@Request() req: any, @Body() data: any) {
        await this.service.deleteFollow(req?.user?.account, data);
        return true;
    }

    @Get('get-comment')
    async getComment(@Request() req: any, @Query('account') account: string) {
        if (!account) {
            account = req?.user?.account;
        }

        return await this.service.getComment(account);
    }

    @Post('add-comment')
    async addComment(@Request() req: any, @Body() data: any) {
        await this.service.addComment(data.account, data?.content, data?.star, req?.user?.account);
        return true;
    }

    @Post('delete-comment')
    async deleteComment(@Request() req: any, @Body() data: any) {
        await this.service.deleteComment(data.account, data?.id);
        return true;
    }

    @Post('edit-comment')
    async edit(@Body() data: any) {
        await this.service.editComment(data.account, data?.comment);
        return true;
    }

    @Post('edit-user-all')
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
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Request() req: any) {
        const avatar = `/uploads/image/${file.filename}`;
        const data: any = {
            avatar,
            description: body?.description || '',
            login_name: body?.login_name || '',
            field: body?.field || '',
            scale: body?.scale || '',
            phone: body?.phone || '',
            email: body?.email || '',
            web: body?.web || '',
            address: body?.address || '',
        };

        return await this.service.editUserCompany(req?.user?.account, data);
    }
}
