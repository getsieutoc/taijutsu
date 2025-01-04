import { Metadata } from 'next';
import { AuthView } from './auth-view';

export const metadata: Metadata = {
  title: 'Authentication',
};

export default function AuthPage() {
  return <AuthView />;
}
