'use client';
import Link from "next/link";
import { Button } from "./Button";
import { ArrowRight } from "@phosphor-icons/react";
import dayjs from 'dayjs';
import { ReactNode } from "react";

type CardProps = {
  title: string;
  date: Date;
  url: string;
  children?: ReactNode;
}

export function Card({ date, title, url, children }: CardProps) {
  return (
    <div
      className="rounded-2xl bg-zinc-200 dark:bg-zinc-900 p-1 shadow-xl"
    >
      <div className="block rounded-xl bg-zinc-100 dark:bg-zinc-800 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link href={url} title="Acessar hábito">
              Acessar
              <ArrowRight size={16} className="block ml-1 transition duration-200 transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          {children}
        </div>
        <div className="mt-5">
          <h3 className="text-md font-bold text-zinc-800 dark:text-zinc-100 sm:text-lg">
            {title}
          </h3>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {dayjs(date).fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
}
