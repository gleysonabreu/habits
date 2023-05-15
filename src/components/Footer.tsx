'use client';
import Link from "next/link";
import { Logo } from "./Logo";
import { FacebookLogo, GithubLogo, InstagramLogo, TwitterLogo } from "@phosphor-icons/react";

export function Footer() {
  return (
    <footer className="bg-zinc-200 dark:bg-zinc-900 w-full">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="scale-50">
            <Logo />
          </div>
        </div>

        <p className="mx-auto max-w-md text-center leading-relaxed text-zinc-500 dark:text-zinc-400">
          © 2023. Todos os direitos reservados.
        </p>

        <ul className="mt-6 flex justify-center gap-6 md:gap-8">
          <li>
            <Link
              href="/"
              rel="noreferrer"
              target="_blank"
              className="text-gray-500 dark:text-zinc-400 transition hover:text-brand-primary"
            >
              <span className="sr-only">Facebook</span>
              <FacebookLogo size={25} />
            </Link>
          </li>

          <li>
            <Link
              href="/"
              rel="noreferrer"
              target="_blank"
              className="text-gray-500 dark:text-zinc-400 transition hover:text-brand-primary"
            >
              <span className="sr-only">Instagram</span>
              <InstagramLogo size={25} />
            </Link>
          </li>

          <li>
            <Link
              href="/"
              rel="noreferrer"
              target="_blank"
              className="text-gray-500 dark:text-zinc-400 transition hover:text-brand-primary"
            >
              <span className="sr-only">Twitter</span>
              <TwitterLogo size={25} />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
