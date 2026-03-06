import { Component } from 'react';

class ChatErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Swallow UI-only errors to avoid breaking the page shell.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-5 right-5 z-40 max-w-[280px] rounded-xl border border-red-300/60 bg-white/95 p-3 text-xs text-slate-700 shadow-lg backdrop-blur-sm dark:border-red-500/40 dark:bg-slate-900/85 dark:text-slate-100">
          Sorry, I am having trouble right now. Please try again or use the contact form below.
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChatErrorBoundary;

