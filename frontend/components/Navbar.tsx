"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, PlusCircle, LayoutDashboard, Briefcase, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  if (loading) return null;

  return (
    <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        
        <div className="flex items-center gap-8">
          <Link href={user ? "/dashboard" : "/"} className="text-2xl font-bold tracking-tight">
            Gig<span className="text-primary">Flow</span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link 
                href="/dashboard" 
                className={isActive('/dashboard') ? "text-primary" : "text-muted-foreground hover:text-primary"}
              >
                Dashboard
              </Link>
              <Link 
                href="/gigs" 
                className={isActive('/gigs') ? "text-primary" : "text-muted-foreground hover:text-primary"}
              >
                Browse Gigs
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "owner" && (
                <Button asChild size="sm" className="hidden sm:flex">
                  <Link href="/gigs/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Post a Gig
                  </Link>
                </Button>
              )}

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground font-normal uppercase">{user.role}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="md:hidden">
                    <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="md:hidden">
                    <Link href="/gigs"><Briefcase className="mr-2 h-4 w-4" /> Browse Gigs</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-3">
              <Button variant="ghost" asChild><Link href="/login">Login</Link></Button>
              <Button asChild><Link href="/register">Join</Link></Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}