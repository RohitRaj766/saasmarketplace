import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database';
import { config } from '../../config/env';
import { AppError } from '../../common/middleware/error.middleware';

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    organizationName: string;
    plan?: string;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create organization slug from name
    const slug = data.organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug already exists
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrg) {
      throw new AppError('Organization name already taken. Please choose a different name.', 400);
    }

    // Determine plan limits
    const planLimits: Record<string, number> = {
      free: 5,
      starter: 10,
      professional: 50,
      enterprise: 999,
    };

    const plan = data.plan || 'free';
    const maxUsers = planLimits[plan] || 5;

    // Create organization and owner user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: data.organizationName,
          slug,
          plan,
          maxUsers,
          planStartDate: new Date(),
        },
      });

      // Create owner user
      const user = await tx.user.create({
        data: {
          organizationId: organization.id,
          email: data.email,
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'admin',
          isOwner: true,
        },
        select: {
          id: true,
          organizationId: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isOwner: true,
          createdAt: true,
        },
      });

      return { user, organization };
    });

    const tokens = await this.generateTokens(result.user);

    return { user: result.user, organization: result.organization, ...tokens };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
      },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if organization is active
    if (!user.organization.isActive) {
      throw new AppError('Your organization account is inactive. Please contact support.', 403);
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        organizationId: user.organizationId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isOwner: user.isOwner,
        department: user.department,
        jobTitle: user.jobTitle,
      },
      organization: {
        id: user.organization.id,
        name: user.organization.name,
        slug: user.organization.slug,
        plan: user.organization.plan,
        maxUsers: user.organization.maxUsers,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      jwt.verify(refreshToken, config.refreshToken.secret) as any;

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new AppError('Invalid refresh token', 401);
      }

      const accessToken = this.generateAccessToken(storedToken.user);

      return { accessToken };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  private async generateTokens(user: any) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  private generateAccessToken(user: any) {
    return jwt.sign(
      {
        userId: user.id,
        organizationId: user.organizationId,
        email: user.email,
        role: user.role,
        isOwner: user.isOwner || false,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
    );
  }

  private async generateRefreshToken(userId: string) {
    const token = jwt.sign(
      { userId }, 
      config.refreshToken.secret, 
      { expiresIn: config.refreshToken.expiresIn } as jwt.SignOptions
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return token;
  }
}
