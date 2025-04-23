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

}
