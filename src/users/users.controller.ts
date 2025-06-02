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
    async editUser(@Request() req: any, @Body() data: any){
        await this.service.editUser(req?.user?.account, data);
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
    async getFollow(@Request() req: any) {
        return await this.service.getFollow(req?.user?.account);
    }

    @Post('add-follow')
    async addFollow(@Request() req: any, @Body() data: any) {
        await this.service.addFollow(req?.user?.account, data?.id);
        return true;
    }

    @Post('delete-follow')
    async deleteFollow(@Request() req: any, @Body() data: any) {
        await this.service.deleteFollow(req?.user?.account, data?.id);
        return true;
    }

    @Get('get-comment')
    async getComment(@Request() req: any) {
        return await this.service.getComment(req?.user?.account);
    }

    @Post('add-comment')
    async addComment(@Request() req: any, @Body() data: any) {
        await this.service.addComment(req?.user?.account, data?.content, data?.star);
        return true;
    }

    @Post('delete-comment')
    async deleteComment(@Request() req: any, @Body() data: any) {
        await this.service.deleteComment(req?.user?.account, data?.id);
        return true;
    }

    @Post('edit-comment')
    async edit(@Request() req: any, @Body() data: any) {
        await this.service.editComment(req?.user?.account, data?.comment);
        return true;
    }



    @Post('/update-avatar')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                    callback(null, filename);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    return callback(new Error('Only image files are allowed!'), false);
                }
                callback(null, true);
            },
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return {
            message: 'Upload thành công!',
            filePath: `/uploads/${file.filename}`,
        };
    }
}
