'use client';
import { Trash } from "@phosphor-icons/react";
import { Button } from "./Button";

type DeleteHabitProps = {
  id: string;
}

export function DeleteHabit({ id }: DeleteHabitProps) {
  return (
    <Button variant="red" title='Deletar'>
      Deletar
      <Trash size={16} className="block ml-1 transition duration-200 transform group-hover:translate-x-0.5" />
    </Button>
  );
}
