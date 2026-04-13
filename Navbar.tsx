import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';

interface NavbarProps {
  title: string;
  showBack?: boolean;
  role?: 'patient' | 'doctor';
}

export default function Navbar({ title, showBack = true, role = 'patient' }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/patient' || location.pathname === '/doctor';

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-lg ${
      role === 'doctor' ? 'bg-blue-600/95' : 'bg-emerald-600/95'
    } text-white shadow-lg`}>
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
        {showBack && !isHome && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl hover:bg-white/20 active:bg-white/30 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
        )}
        <div className="flex items-center gap-2 flex-1">
          <Heart size={20} className="text-red-300" fill="currentColor" />
          <h1 className="text-lg font-bold tracking-tight truncate">{title}</h1>
        </div>
        {isHome && (
          <button
            onClick={() => navigate('/')}
            className="text-xs bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors font-medium"
          >
            Switch Role
          </button>
        )}
      </div>
    </nav>
  );
}
