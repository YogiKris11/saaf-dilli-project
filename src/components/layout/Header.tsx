'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wind, LogOut, Shield, User as UserIcon } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/dashboard/citizen', label: 'Home' },
  { href: '/dashboard/forecast', label: 'Forecast' },
  { href: '/dashboard/datainsights', label: 'Data Insights' },
  { href: '/community', label: 'Community' },
];

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-50 mx-4 md:mx-10 my-4">
      <div className="flex items-center justify-between whitespace-nowrap rounded-full border border-primary/20 bg-black/30 px-6 py-3 backdrop-blur-lg">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/citizen" className="flex items-center space-x-2">
            <span className="font-display text-4xl font-bold tracking-tighter text-white">Saaf-Dilli</span>
          </Link>
        </div>

         <nav className="hidden md:flex items-center gap-8 text-base font-medium text-white/80">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                    'hover:text-primary transition-colors',
                    pathname === link.href && 'text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
             {user && (
                 <Link
                  href="/profile"
                  className={cn(
                    'hover:text-primary transition-colors',
                    pathname === "/profile" && 'text-primary'
                  )}
                >
                  Profile
                </Link>
             )}
          </nav>

        <div className="flex items-center gap-4 text-white/80">
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <button onClick={logout} className="text-primary hover:underline">
                Logout
              </button>
            </>
          ) : (
            <Button asChild size="sm" variant="ghost">
              <Link href="/login" className="text-white hover:text-primary">
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export function PolicyHeader() {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="inline-block font-bold">Policy Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
                {user && <span className="text-sm font-medium text-muted-foreground">Welcome, {user.name}</span>}
                <Button onClick={logout} variant="outline" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
        </header>
    );
}
