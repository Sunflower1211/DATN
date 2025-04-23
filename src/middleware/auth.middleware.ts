import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private readonly jwtService: JwtService) {}

  async use(req: any, res: Response, next: NextFunction) {
    const query = req?.query || {};
    const rawEncryptCode = req.headers['encrypt-code'] || req.get('encrypt-code') || query['encrypt-code'] || '';
    const encrypt_code = String(rawEncryptCode).replace(/ /g, '+');
    console.log(req.baseUrl)

    if (encrypt_code) {
      try {
        const decoded = await this.jwtService.verifyToken(encrypt_code);
        req.user = decoded;
        return next();
      } catch (error) {
        const ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.socket.remoteAddress;
        console.log(`UNAUTHORIZED: decrypted false from IP ${ip}`);
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: HttpStatus.UNAUTHORIZED,
          msg: 'UNAUTHORIZED',
        });
      }
    } else {
      console.log('UNAUTHORIZED: encrypt_code missing');
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: HttpStatus.UNAUTHORIZED,
        msg: 'UNAUTHORIZED',
      });
    }
  }
}
