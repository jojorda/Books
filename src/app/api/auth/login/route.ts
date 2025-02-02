import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database';
import bcrypt from 'bcryptjs';

interface DbUser {
  id: number;
  username: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // Log the query for debugging
    console.log('Attempting login for email:', email);
    
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]) as DbUser;
    
    // Log if user was found (without sensitive data)
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('No user found with email:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    // Log password validation result (without exposing the actual password)
    console.log('Password validation:', isValidPassword ? 'Success' : 'Failed');

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    console.log('Login successful for user:', email);

    // Return user data without the password
    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
