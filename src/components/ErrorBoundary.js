import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) {
    console.error(error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{color: "red", textAlign: "center", padding: 40}}>Bir hata oluştu. Lütfen sayfayı yenileyin.</div>;
    }
    return this.props.children;
  }
}
