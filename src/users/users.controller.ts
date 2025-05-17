import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
    constructor(private service: UsersService){}

    @Post('/login')
    async Login(@Body(new ValidationPipe) data: LoginDto){
        return this.service.Login(data.account, data.password);
    }

    @Post('/register')
    async Register(@Body() data: any){
        return this.service.Register(data.account, data.password, data.login_name);
    }

    @Get('/info-user')
    async infoUser(@Query('token') token: string){
        return this.service.infoUser(token);
    }

}
