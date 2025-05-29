import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/create-post')
  async create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    return await this.postsService.create(createPostDto, req?.user?.account);
  }

  @Get('/get-posts')
  async findAll() {
    return await this.postsService.findAll();
  }

  @Get('/get-posts-user')
  async findAllPostUser(@Request() req: any) {
    return await this.postsService.findAllPostUser(req?.user?.account);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Post('/update/:id')
  async update(@Body() UpdatePostDto: UpdatePostDto, @Param('id') id: string) {
    return await this.postsService.update(UpdatePostDto, id);
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    return await this.postsService.remove(id);
  }
}
