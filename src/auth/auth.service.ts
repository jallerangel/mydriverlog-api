import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        name: dto.name,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    return rest;
  }

  async login(dto: LoginDto) {
    // Ensure we explicitly request the password field (Prisma returns all scalar fields by default,
    // but being explicit avoids accidental omission from custom select middleware or future changes)
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, email: true, password: true, name: true, createdAt: true },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const userPassword = user.password;
    const valid = await bcrypt.compare(dto.password, userPassword);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { accessToken: token };
  }
}
