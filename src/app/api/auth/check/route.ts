import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database';

interface DbUser {
  email: string;
}

interface UserCount {
  count: number;
}

export async function GET() {
  try {
    const db = await getDb();
    
    // Get total number of users
    const userCount = await db.get('SELECT COUNT(*) as count FROM users') as UserCount;
    
    // Get list of emails (for debugging)
    const users = await db.all('SELECT email FROM users') as DbUser[];
    
    return NextResponse.json({
      status: 'Database connected',
      userCount: userCount.count,
      users: users.map((user: DbUser) => user.email)
    });
  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json(
      { error: 'Database check failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
