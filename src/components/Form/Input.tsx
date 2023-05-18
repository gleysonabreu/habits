import clsx from "clsx";
import { InputHTMLAttributes } from "react";
import { useFormContext } from 'react-hook-form'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string
}

export function Input(props: InputProps) {
  const { register, formState: { errors } } = useFormContext()

  return (
    <input
      id={props.name}
      className={clsx("w-full focus:ring-brand-primary rounded-lg focus:outline-none focus:ring-2 placeholder:text-zinc-500 border-2 dark:bg-zinc-800 bg-zinc-300 p-4 text-sm shadow-sm", {
        "border-zinc-300 dark:border-zinc-800": !errors[props.name],
        "border-red-500": errors[props.name]
      })}
      {...register(props.name)}
      {...props}
    />
  )
}
