"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Geist_Mono } from "next/font/google";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { Loader2, Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-geist-mono",
});

const Navbar = () => {
  const { user, isLoading, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    logout(); // Clear the Zustand store
  };

  return (
    <nav className="w-full sticky rounded-lg px-5 top-0 z-50 shadow-sm border-b border-border backdrop-blur-sm bg-background/60">
      <div className="flex justify-between items-center h-16">
        <Link href="/">
          <h1
            className={`${geistMono.variable} font-mono text-2xl font-bold hover:text-primary transition-colors`}
          >
            Husky
          </h1>
        </Link>
        <div className="items-center space-x-4 hidden md:flex">
          <ThemeToggle />
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : user ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  Profile
                </Button>
              </Link>
              <Button onClick={handleSignOut} variant="ghost" size="sm">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
        <Sheet>
          <SheetTrigger className="md:hidden">{<Menu />}</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <ThemeToggle />
            </SheetHeader>
            <div className="flex flex-col mx-3 space-y-3 ">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : user ? (
                <>
                  <Link href="/dashboard">
                    <SheetClose>
                      <Button variant="outline" size="sm">
                        Dashboard
                      </Button>
                    </SheetClose>
                  </Link>
                  <Link href="/profile">
                    <SheetClose>
                      <Button variant="outline" size="sm">
                        Profile
                      </Button>
                    </SheetClose>
                  </Link>
                  <Button variant="outline" size="sm">
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <SheetClose>
                      <Button size="sm">Sign In</Button>
                    </SheetClose>
                  </Link>
                  <Link href="/auth/register">
                    <SheetClose>
                      <Button variant="outline" size="sm">
                        Sign Up
                      </Button>
                    </SheetClose>
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
