import React, { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  message?: string;
  styles?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1 className={`${this.props.styles} bg-main-dark-blue angle-right mt-[calc(80vh/2)] m-auto w-[400px] text-white text-center`}>
          {this.props.message || 'We\'re sorry. Something went wrong.'}
        </h1>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
