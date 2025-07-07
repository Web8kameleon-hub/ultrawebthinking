"use client"

import React from "react"

interface State {
  hasError: boolean
  errorInfo: string
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: {}) {
    super(props)
    this.state = { hasError: false, errorInfo: "" }
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true, errorInfo: "Një gabim ndodhi gjatë ngarkimit të komponentit." }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Gabim i kapur nga ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            backgroundColor: "#1f1f2f",
            color: "#ff5555",
            padding: "2rem",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>❌ Gabim në sistem</h2>
          <p>{this.state.errorInfo}</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
