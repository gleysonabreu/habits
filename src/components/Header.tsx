'use client';
import Link from "next/link";
import { Button } from "./Button";
import { ArrowRight, SignOut } from "@phosphor-icons/react";
import { Logo } from "./Logo";
import { signOut, useSession } from "next-auth/react";

export function Header() {

  const { data: session } = useSession();

  return (
    <div className="fixed inset-0 z-40 h-16 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800 w-full">
      <div className="relative z-index px-4 mx-auto max-w-screen-2xl">
        <div className="relative z-10 flex items-center justify-center w-full h-16 px-4 md:justify-between">
          <Link href="/dashboard" className="flex items-center justify-center w-1/6 h-16 hover:opacity-80">
            <p className="sr-only">hábitos</p>
            <div className="flex items-center justify-center transform scale-50">
              <Logo />
            </div>
          </Link>
          <div className="hidden md:flex gap-3 items-center justify-end flex-1">
            <Button variant='brand'>
              <span className="block">Configurações</span>
              <ArrowRight size={16} className="block ml-1 transition duration-200 transform group-hover:translate-x-0.5" />
            </Button>

            {session && (
              <Button onClick={() => signOut()}>
                <span className="block">Sair</span>
                <SignOut size={16} className="block ml-1 transition duration-200 transform group-hover:translate-x-0.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
