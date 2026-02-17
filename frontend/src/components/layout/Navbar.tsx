"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import NotificationBell from '@/components/notifications/NotificationBell';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-background border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-primary">
                            PetAdopt
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link href="/pets" className="hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                                Browse Pets
                            </Link>
                            {user ? (
                                <>
                                    <NotificationBell />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src="/avatars/01.png" alt="@user" />
                                                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end" forceMount>
                                            <DropdownMenuLabel className="font-normal">
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                                    <p className="text-xs leading-none text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {user.role === 'admin' ? (
                                                <>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/admin">Admin Dashboard</Link>
                                                    </DropdownMenuItem>
                                                </>
                                            ) : (
                                                <DropdownMenuItem asChild>
                                                    <Link href="/dashboard">My Applications</Link>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={logout}>
                                                Log out
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost">Login</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button>Register</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <Button variant="ghost" onClick={toggleMenu} type="button" aria-controls="mobile-menu" aria-expanded="false">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/pets" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground">
                            Browse Pets
                        </Link>
                        {user ? (
                            <>
                                {user.role === 'admin' ? (
                                    <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground">
                                        Admin Dashboard
                                    </Link>
                                ) : (
                                    <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground">
                                        My Applications
                                    </Link>
                                )}
                                <Button variant="ghost" onClick={logout} className="w-full justify-start mt-2">
                                    Log out
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2 mt-4">
                                <Link href="/login">
                                    <Button variant="ghost" className="w-full justify-start">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="w-full">Register</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
