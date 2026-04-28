import { motion } from 'motion/react';
import { LogIn, LogOut, Shield } from 'lucide-react';
import { loginWithGoogle, logout, auth } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export const Header = () => {
  const [user] = useAuthState(auth);

  return (
    <header className="border-b border-zinc-800 bg-black py-4 px-6 fixed top-0 w-full z-50 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="bg-orange-500 p-2 rounded">
          <Shield className="text-black w-5 h-5" />
        </div>
        <div>
          <h1 className="text-white font-bold tracking-tight text-lg">ReliefSync</h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono">Crisis Response MVP</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-xs font-mono hidden sm:block">{user.email}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={loginWithGoogle}
            className="flex items-center gap-2 bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign in</span>
          </button>
        )}
      </div>
    </header>
  );
};
