import { Module } from '@nestjs/common';
import { ApplyService } from './apply.service';
import { ApplyController } from './apply.controller';
import { Post, PostSchema } from 'src/schema/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
      imports: [
          MongooseModule.forFeature([
              {
                  name: Post.name,
                  schema: PostSchema,
              },
              {
                  name: User.name,
                  schema: UserSchema,
              },
          ]),
      ],
  controllers: [ApplyController],
  providers: [ApplyService],
})
export class ApplyModule {}
