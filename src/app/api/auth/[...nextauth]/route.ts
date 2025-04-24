import NextAuth from 'next-auth';
// eslint-disable-next-line import/extensions
import authOptions from '@/lib/authOptions';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
