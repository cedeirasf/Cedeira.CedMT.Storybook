import type React from "react"
import { Component, type ErrorInfo, type ReactNode } from "react"
import { useToast } from "../../../hooks/ui/use-toast"

interface Props {
  children: ReactNode
  fallback: ReactNode
  onError?: (error: Error) => void
}

interface State {
  hasError: boolean
}

// Wrapper component to use hooks
const ErrorBoundaryWrapper: React.FC<Props> = ({ children, fallback, onError }) => {
  const { toast } = useToast()

  return (
    <ErrorBoundaryInner toast={toast} fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundaryInner>
  )
}

// Inner class component that receives toast function
class ErrorBoundaryInner extends Component<Props & { toast: any }, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error)
    }

    // Show toast notification
    this.props.toast({
      title: "Error",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
      duration: 5000,
    })

    // Log error to console for debugging
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

// Export the wrapper component
export { ErrorBoundaryWrapper as ErrorBoundary }

