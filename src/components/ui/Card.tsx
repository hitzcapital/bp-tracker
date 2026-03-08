import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-4 ${onClick ? 'cursor-pointer hover:bg-slate-800 transition-colors' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
