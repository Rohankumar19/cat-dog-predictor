"use client"

import type React from "react"

// Adapted from https://ui.shadcn.com/docs/components/toast
import { useState, useCallback } from "react"

export type ToastProps = {
  id?: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export type ToastActionElement = React.ReactElement

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(
    ({ ...props }: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast = { ...props, id }

      setToasts((prevToasts) => [...prevToasts, newToast])

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
      }, 5000)

      return id
    },
    [setToasts],
  )

  const dismiss = useCallback(
    (toastId?: string) => {
      if (toastId) {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId))
      } else {
        setToasts([])
      }
    },
    [setToasts],
  )

  return {
    toast,
    dismiss,
    toasts,
  }
}

export type ToastContextType = ReturnType<typeof useToast>

