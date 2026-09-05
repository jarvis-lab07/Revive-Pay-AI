import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen app-shell flex items-center justify-center p-4">
          <div className="surface p-8 max-w-md w-full text-center shadow-lift">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-rose-100">
              <AlertTriangle size={28} />
            </div>
            <h1 className="font-display text-2xl font-semibold text-ink mb-2">Something went wrong</h1>
            <p className="text-ink-muted mb-6 text-sm leading-relaxed">
              {this.state.error?.message || 'An unexpected error occurred in the application.'}
            </p>
            <Button variant="primary" className="w-full justify-center" onClick={() => window.location.reload()}>
              <RefreshCcw size={16} />
              Reload application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
