import React from "react";
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error(error);
    console.log(errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <h1> An error has occurred</h1>;
    }
    return this.props.children;
  }
}
