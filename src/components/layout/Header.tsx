import { HeartPulse } from 'lucide-react'

interface HeaderProps {
  title?: string
}

export function Header({ title = 'BP Tracker' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      <div className="flex items-center justify-center h-14 px-4">
        <div className="flex items-center gap-2">
          <HeartPulse size={22} className="text-red-500" />
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>
      </div>
    </header>
  )
}
