// jwt-example.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService as JwtServiceDefault } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: JwtServiceDefault) {}

  // Tạo token
  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }

  // Giải mã token (chỉ đọc, không xác thực signature)
  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }

  // Giải mã + xác thực signature
  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
