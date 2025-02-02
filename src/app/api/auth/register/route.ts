import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    const db = await getDb();
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    return NextResponse.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
