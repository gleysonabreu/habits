'use client';
import { GithubLogo, GoogleLogo, TwitchLogo } from '@phosphor-icons/react'
import { signIn } from 'next-auth/react';
import { Button } from "./Button";
import { Alert } from './Alert';

export type SignInErrorTypes =
  | "Signin"
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired"
  | "default"

type SignInProps = {
  error?: SignInErrorTypes;
}

export function SignIn({ error: errorType }: SignInProps) {
  const errors: Record<SignInErrorTypes, string> = {
    Signin: "Tente logar com uma conta diferente.",
    OAuthSignin: "Tente logar com uma conta diferente.",
    OAuthCallback: "Tente logar com uma conta diferente.",
    OAuthCreateAccount: "Tente logar com uma conta diferente.",
    EmailCreateAccount: "Tente logar com uma conta diferente.",
    Callback: "Tente logar com uma conta diferente.",
    OAuthAccountNotLinked:
      "Para confirmar sua identidade, logue com a mesma conta usada originalmente.",
    EmailSignin: "O e-email não pode ser enviado.",
    CredentialsSignin:
      "Loguin falhou. Verifique se os dados estão corretos.",
    SessionRequired: "Por favor, faça login para acessar esta página.",
    default: "Não foi possível acessar a plataforma.",
  }

  const error = errorType && (errors[errorType] ?? errors.default);

  return (
    <div className='flex w-full h-full items-center flex-col max-w-lg bg-zinc-200 p-5 rounded-lg dark:bg-zinc-900 gap-10'>
      {error && (
        <div className='w-full'>
          <Alert text={error} type='danger' title={errorType} />
        </div>
      )}

      <h1 className='font-bold text-xl text-center text-zinc-800 dark:text-zinc-100'>Acesse a plataforma</h1>
      <div className='flex flex-col flex-1 w-full items-center justify-center gap-4'>
        <Button onClick={() => signIn('github')} isFull size='xl'><GithubLogo size={25} weight='fill' /> Github</Button>
        <Button onClick={() => signIn('twitch')} isFull size='xl' variant='purple'><TwitchLogo size={25} weight='fill' /> Twitch</Button>
        <Button onClick={() => signIn('google')} isFull size='xl' variant='white'><GoogleLogo size={25} weight='fill' /> Google</Button>
      </div>
    </div>
  );
}
