"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PlusCircle,
  LayoutDashboard,
  Briefcase,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Notifications from "./Notifications";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return null;

  const isOwner = user?.role === "owner";

  const brandColor = isOwner ? "text-client" : "text-freelancer";
  const brandBg = isOwner
    ? "bg-client hover:bg-emerald-700"
    : "bg-freelancer hover:bg-teal-600";
  const statusDot = isOwner ? "bg-client" : "bg-freelancer";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

        <div className="flex items-center gap-10">
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-2 group"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105 ${
                user ? brandBg : "bg-emerald-500"
              }`}
            >
              <span className="text-lg font-bold text-white">G</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Gig
              <span className={user ? brandColor : "text-emerald-500"}>
                Flow
              </span>
            </span>
          </Link>
        </div>
        <div>
          {user && (
            <div className="hidden md:flex items-center gap-1 bg-slate-50/50 p-1 rounded-xl border border-slate-100/50">
              <Link
                href="/dashboard"
                className={`group relative flex items-center gap-2.5 px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-lg ${
                  pathname === "/dashboard"
                    ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/60"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <LayoutDashboard
                  size={16}
                  className={`transition-colors duration-200 ${
                    pathname === "/dashboard"
                      ? brandColor
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                Dashboard
                {pathname === "/dashboard" && (
                  <span
                    className={`absolute bottom-1 left-1/2  w-1.5 h-1.5 rounded-full ${
                      isOwner ? "bg-emerald-950" : "bg-teal-500"
                    }`}
                  />
                )}
              </Link>

              <Link
                href="/gigs"
                className={`group relative flex items-center gap-2.5 px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-lg ${
                  pathname === "/gigs"
                    ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/60"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Briefcase
                  size={16}
                  className={`transition-colors duration-200 ${
                    pathname === "/gigs"
                      ? brandColor
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                Marketplace
                {pathname === "/gigs" && (
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      isOwner ? "bg-emerald-950" : "bg-teal-500"
                    }`}
                  />
                )}
              </Link>
            </div>
          )}
        </div>


        <div className="flex items-center gap-3">
          {user && (
            <>
              {isOwner && (
                <Button
                  asChild
                  className={`hidden rounded-xl px-5 font-semibold text-white shadow-sm transition-all sm:flex ${brandBg}`}
                >
                  <Link href="/gigs/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Post a Gig
                  </Link>
                </Button>
              )}

              <Notifications />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full border border-slate-200 bg-white p-0 shadow-sm transition-all hover:bg-slate-50"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback
                        className={`text-white font-bold ${brandBg}`}
                      >
                        {user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-64 mt-2 rounded-2xl p-1 shadow-xl border-slate-100"
                  align="end"
                >
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-bold text-slate-900">
                        {user.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${statusDot}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          {user.role}{user.role==='owner' ? "/Client" : ""}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg cursor-pointer py-2.5 px-3 focus:bg-slate-50 transition-colors"
                  >
                    <Link
                      href="/profile"
                      className="flex items-center w-full text-slate-700 font-medium"
                    >
                      <User className="mr-3 h-4 w-4 text-slate-400" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem
                    className="rounded-lg cursor-pointer py-2.5 px-3 text-rose-500 font-medium focus:bg-rose-50 focus:text-rose-600 transition-colors"
                    onClick={logout}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
