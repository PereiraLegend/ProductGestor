// components/Navbar.tsx
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <a className="text-white font-bold text-xl">My Blog</a>
        </Link>
        <div>
          {user ? (
            <button onClick={logout} className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700">
              Logout
            </button>
          ) : (
            <Link href="/login">
              <a className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700">Login</a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
