import { clsx, type ClassValue } from 'clsx'

function twMerge(cls: string) {
  return cls;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
