import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink text-chalk">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(194,164,107,0.08),_transparent_45%),radial-gradient(ellipse_at_bottom_right,_rgba(36,41,50,0.55),_transparent_40%)]"
      />
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
