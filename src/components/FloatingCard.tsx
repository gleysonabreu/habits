'use client';
import * as HoverCard from '@radix-ui/react-hover-card';
import Link from 'next/link';
import Image from 'next/image';

type HoverCardProps = {
  user: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
    _count: {
      habits: number;
    };
  };
};

export function FloatingCard({ user }: HoverCardProps) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <Link href={`/me/${user.username}`}>
          <Image
            width={40}
            height={40}
            className="cursor-pointer inline-block h-10 w-10 rounded-full ring-2 ring-zinc-100 dark:ring-zinc-900"
            src={user.image ?? '/default-avatar.svg'}
            alt="Foto de perfil do usuário"
          />
        </Link>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade w-[300px] rounded-xl bg-zinc-100 dark:bg-zinc-800 p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:transition-all"
          sideOffset={5}
        >
          <div className="flex flex-col gap-[7px]">
            <Image
              className="block h-[60px] w-[60px] rounded-full"
              width={60}
              height={60}
              src={user.image ?? '/default-avatar.svg'}
              alt="Foto de Perfil"
            />
            <div className="flex flex-col gap-[15px]">
              <div>
                <div className="text-mauve12 m-0 text-[15px] font-medium leading-[1.5]">
                  {user.name}
                </div>
                <Link
                  href={`/me/${user.username}`}
                  className="text-mauve10 m-0 text-[15px] leading-[1.5] hover:text-brand-primary transition-colors"
                >
                  @{user.username}
                </Link>
              </div>
              <div className="flex gap-[15px]">
                <div className="flex gap-[5px]">
                  <div className="text-mauve12 m-0 text-[15px] leading-[1.5] text-brand-primary font-bold">
                    {user._count.habits}
                  </div>
                  <div className="text-mauve10 m-0 text-[15px] leading-[1.5]">
                    Hábitos
                  </div>
                </div>
              </div>
            </div>
          </div>

          <HoverCard.Arrow className="fill-zinc-100 dark:fill-zinc-800" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
