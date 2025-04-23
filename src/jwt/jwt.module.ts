// jwt-example.module.ts
import { Module } from '@nestjs/common';
import { JwtModule as JwtModuleDefault } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'process.env', isGlobal: true }),
    JwtModuleDefault.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
