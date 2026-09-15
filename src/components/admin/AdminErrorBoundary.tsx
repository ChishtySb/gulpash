import React from 'react';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  moduleName?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class AdminErrorBoundary extends React.Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Admin Module Error Caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 sm:p-8 max-w-3xl mx-auto my-8 bg-white border border-rose-200 rounded-xl shadow-sm font-sans">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 block mb-1">
                Admin Error Recovery
              </span>
              <h2 className="text-lg font-bold text-stone-900">
                {this.props.moduleName || 'Admin Module'} Encountered an Issue
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                A rendering or runtime exception occurred in this admin panel view. Your database and existing storefront operations remain completely safe and untouched.
              </p>

              {this.state.error && (
                <div className="mt-3 p-3 bg-stone-900 text-rose-300 font-mono text-[11px] rounded-md overflow-x-auto max-h-36">
                  {this.state.error.message || 'Unknown error occurred'}
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-md flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Module</span>
                </button>

                {this.props.onReset && (
                  <button
                    type="button"
                    onClick={this.props.onReset}
                    className="px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-md flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Return to Overview</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
