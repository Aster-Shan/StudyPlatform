"use client"

import axios from "axios"
import React, { useEffect, useState } from "react"

export default function ApiTest() {
  const [testResult, setTestResult] = useState<string>("Testing...")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testApi = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("/api/documents/test-json")
        setTestResult(JSON.stringify(response.data, null, 2))
      } catch (err) {
        console.error("API test failed:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }

    testApi()
  }, [])

  return (
    <div className="card">
      <div className="card-header">
        <h5>API Test</h5>
      </div>
      <div className="card-body">
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">
            <h6>Error:</h6>
            <pre>{error}</pre>
          </div>
        ) : (
          <div>
            <h6>Response from /api/documents/test-json:</h6>
            <pre className="bg-light p-3 rounded">{testResult}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
