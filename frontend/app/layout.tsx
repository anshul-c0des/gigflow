import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: "GigFlow",
  description: "Connect with elite talent and secure high-value gigs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${jakarta.variable} font-sans bg-slate-50 text-slate-900`}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            
            <main className="flex-1">
              {children}
            </main>
            
            <Toaster 
              position="top-right"
              toastOptions={{
                className: 'rounded-xl border border-slate-100 font-medium py-4 px-6 shadow-lg',
                success: {
                  iconTheme: { primary: '#10B981', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#F43F5E', secondary: '#fff' },
                }
              }}
            />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}