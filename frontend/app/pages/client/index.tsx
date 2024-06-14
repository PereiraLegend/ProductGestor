import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.regra !== 'Usuario') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Client Dashboard</h1>
      <button onClick={logout} className="bg-red-500 text-white p-2 rounded">
        Logout
      </button>
      {/* Add functionality to view and filter posts */}
    </div>
  );
};

export default ClientDashboard;
