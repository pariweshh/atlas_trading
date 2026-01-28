import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "./button"

interface ErrorMessageProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorMessage({
  title = "Something went wrong",
  message = "An error occurred while loading data",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-3 bg-red-500/10 rounded-full mb-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-400 mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}
