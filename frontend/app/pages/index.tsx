// pages/index.tsx (ou pages/page.tsx)
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.regra === 'Admin') {
          router.push('/admin');
        } else {
          router.push('/client');
        }
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>Redirecting...</div>;
};

export default Home;
