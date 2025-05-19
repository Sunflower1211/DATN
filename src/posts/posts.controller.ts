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
  async findAll(@Request() req: any) {
    return await this.postsService.findAll(req?.user?.account);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
