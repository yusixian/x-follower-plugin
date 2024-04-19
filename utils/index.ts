import clsx, { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function randomMS(start = 40, end = 70) {
  return Math.random() * (end - start) + start
}

export function isScrollBottom(ele: HTMLElement) {
  const clientHeight = ele.clientHeight
  const scrollTop = ele.scrollTop
  const scrollHeight = ele.scrollHeight
  return Math.abs(clientHeight + scrollTop - scrollHeight) <= 1
}
