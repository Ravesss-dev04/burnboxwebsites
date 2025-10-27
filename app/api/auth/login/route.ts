import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyPassword } from '@/lib/auth-utils';
import { createHmac } from 'crypto';
import { corsHeaders } from '@/lib/corsHeaders';


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


function generateToken(userId: string | number) {
  const uid = String(userId);
  const secret = process.env.JWT_SECRET || 'change_this_secret';
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: uid, iat: Math.floor(Date.now() / 1000) })).toString('base64url');
  const data = `${header}.${payload}`;
  const signature = createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${signature}`;
}

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers: corsHeaders  }
      );
    }

    // Verify password
    if (!user.password) {
      console.error('User has no password hash:', user.id);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers: corsHeaders  }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers: corsHeaders  }
      );
    }

    // Generate token
    const token = generateToken(user.id);

    const response = NextResponse.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email }
    });

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders  }
    );
  }
}