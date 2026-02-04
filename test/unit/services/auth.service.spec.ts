import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  const mockPrisma: any = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwt = {
    signAsync: jest.fn().mockResolvedValue('signed-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'PRISMA_CLIENT', useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('registers a new user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({ id: '1', email: 'a@b.com', password: 'hash' });

    const spyHash = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hash');

    const result = await service.register({ email: 'a@b.com', password: 'password' as any });

    expect(mockPrisma.user.findUnique).toBeCalledWith({ where: { email: 'a@b.com' } });
    expect(mockPrisma.user.create).toBeCalled();
    expect(result).toHaveProperty('email', 'a@b.com');
    expect((result as any).password).toBeUndefined();

    spyHash.mockRestore();
  });

  it('throws when credentials invalid on login', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(service.login({ email: 'x@x.com', password: 'p' as any })).rejects.toThrow();
  });

  it('returns token on successful login', async () => {
    const hashed = await bcrypt.hash('password', 10);
    mockPrisma.user.findUnique.mockResolvedValue({ id: '1', email: 'a@b.com', password: hashed });

    const result = await service.login({ email: 'a@b.com', password: 'password' as any });
    expect(result).toHaveProperty('accessToken', 'signed-token');
  });
});
