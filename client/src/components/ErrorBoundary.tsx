import { Component, ErrorInfo, PropsWithChildren, ReactNode } from "react";

type State = {
  hasError: boolean;
  error?: Error;
};

type Props = PropsWithChildren & {
  renderError?: (errorState: State) => ReactNode;
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.renderError?.(this.state) ?? (
          <h1>Sorry.. there was an error</h1>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
