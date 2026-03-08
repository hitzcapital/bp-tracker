import { CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

export function ToastContainer() {
  const { toasts } = useToast()

  const icons = {
    success: <CheckCircle size={18} className="text-green-400" />,
    error: <AlertCircle size={18} className="text-red-400" />,
    info: <Info size={18} className="text-blue-400" />,
  }

  const bgColors = {
    success: 'bg-green-900/80 border-green-700',
    error: 'bg-red-900/80 border-red-700',
    info: 'bg-slate-800/80 border-slate-700',
  }

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg animate-in slide-in-from-right ${bgColors[toast.type]}`}
        >
          {icons[toast.type]}
          <span className="text-sm text-white">{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
