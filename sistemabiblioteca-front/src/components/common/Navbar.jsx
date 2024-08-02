import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import logoImg from "../../assets/logo.png";

const navigation = [
    { name: 'Livros', href: '/books', current: true, requiresAuth: true },
    { name: 'Usuários', href: '/user-management', current: false, requiresAdmin: true }
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar({ isAuthenticated, isAdmin, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <header className="fixed top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto w-full max-w-7xl px-2">
                <div className="flex h-14 items-center justify-between">
                    <img src={logoImg} className="flex items-center w-28" alt="Sistema Bibliotecario" />
                    <nav className='hidden md:flex gap-4'>
                        {/* Ação Livros / Usuários */}
                        <div className="hidden sm:ml-6 sm:flex space-x-4">
                            {navigation.map((item) => (
                                (!item.requiresAuth || (item.requiresAuth && isAuthenticated)) &&
                                (!item.requiresAdmin || (item.requiresAdmin && isAdmin)) && (
                                    <Link key={item.name} to={item.href} className={classNames(item.current ? ' text-white' : 'text-gray-300 ',
                                        'relative rounded-md px-3 py-2 text-sm font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-current after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300')}
                                        aria-current={item.current ? 'page' : undefined} >
                                        {item.name}
                                    </Link>
                                )
                            ))}
                        </div>
                    </nav>
                    {/* Ação Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-none focus:ring-0"><Button variant="secondary">Menu</Button></DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 text-white">
                            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Link className="flex" to={'/profile'}><User className="mr-2 h-4 w-4" />Perfil</Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <Link className="ml-6" onClick={handleLogout}>Sair</Link>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
