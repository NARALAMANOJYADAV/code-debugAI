import '../styles/globals.css';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { AuthProvider } from '../components/auth/AuthContext';

export const metadata = {
  title: 'CodeBug AI - Intelligent Coding & Error Resolver',
  description: 'Practice programming, debug compiler issues, solve algorithmic problems, and learn with AI coding tutors.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-cyber-bg text-slate-100 flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto h-[calc(100vh-61px)] p-3 sm:p-6 bg-coding-bg-grid">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

