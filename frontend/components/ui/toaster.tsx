"use client"

import { AlertCircle, CheckCircle, X } from "lucide-react"
import { useToast } from "./use-toast"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-[420px] w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}

function Toast({
  id,
  title,
  description,
  variant = "default",
}: {
  id?: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}) {
  const { dismiss } = useToast()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={cn(
        "bg-white dark:bg-zinc-800 border rounded-lg shadow-lg p-4 flex items-start gap-3 transform transition-all duration-300 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-[-20px] opacity-0",
        variant === "destructive" ? "border-red-500" : "border-gray-200 dark:border-gray-700",
      )}
    >
      {variant === "destructive" ? (
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
      ) : (
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
      )}

      <div className="flex-1">
        {title && (
          <h5
            className={cn(
              "font-medium text-sm",
              variant === "destructive" ? "text-red-500" : "text-gray-900 dark:text-gray-100",
            )}
          >
            {title}
          </h5>
        )}
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
      </div>

      <button
        onClick={() => dismiss(id)}
        className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}

