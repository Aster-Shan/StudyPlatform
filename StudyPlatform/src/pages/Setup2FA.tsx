

import React from "react"

import { AlertCircle, KeyRound } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"

export default function Setup2FA() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  const [secret, setSecret] = useState("")
  const [qrCodeData, setQrCodeData] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const setup2FA = async () => {
      if (user?.using2FA) return

      setLoading(true)
      try {
        const response = await api.post("/api/2fa/setup")
        setSecret(response.data.secret)
        setQrCodeData(response.data.qrCodeData)
      } catch (err) {
        setError("Failed to set up 2FA. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    setup2FA()
  }, [user])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setVerifying(true)

    try {
      await api.post("/api/2fa/verify", null, {
        params: { code: verificationCode },
      })

      setSuccess(true)
      updateUser({ using2FA: true })

      setTimeout(() => {
        navigate("/profile")
      }, 3000)
    } catch (err: unknown) {

      if (err instanceof Error) {
        setError(err.message || 'Failed to able 2FA. Please try again.');
      } else {
        setError("Failed to able 2FA. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleDisable2FA = async () => {
    try {
      await api.post("/api/2fa/disable")
      updateUser({ using2FA: false })
      navigate("/profile")
    } catch (err: unknown) {

      if (err instanceof Error) {
        setError(err.message || 'Failed to disable 2FA. Please try again.');
      } else {
        setError('Failed to disable 2FA. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold">Two-Factor Authentication</h2>
          <p className="text-sm text-gray-500">
            {user?.using2FA
              ? "Manage your two-factor authentication settings"
              : "Set up two-factor authentication for your account"}
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800 flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {success ? (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
              <p>Two-factor authentication has been enabled successfully. You will be redirected to your profile.</p>
            </div>
          ) : user?.using2FA ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
                <KeyRound className="h-5 w-5 text-green-600" />
                <p className="text-sm">
                  Two-factor authentication is currently <span className="font-semibold">enabled</span> for your
                  account.
                </p>
              </div>
              <button
                className="w-full py-2 px-4 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
                onClick={handleDisable2FA}
              >
                Disable 2FA
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">1. Scan QR Code</h3>
                <p className="text-sm text-gray-500">
                  Scan this QR code with your authenticator app (like Google Authenticator, Authy, or Microsoft
                  Authenticator).
                </p>
                {loading ? (
                  <div className="flex justify-center p-4">Loading...</div>
                ) : (
                  <div className="flex justify-center p-4 bg-gray-50 rounded-md">
                    {qrCodeData ? (
                      <img src={qrCodeData || "/placeholder.svg"} alt="QR Code for 2FA" width={200} height={200} />
                    ) : (
                      <div className="w-[200px] h-[200px] bg-gray-200 flex items-center justify-center">QR Code</div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">2. Manual Setup</h3>
                <p className="text-sm text-gray-500">
                  If you can't scan the QR code, enter this code manually in your app:
                </p>
                <div className="bg-gray-50 p-3 rounded text-center font-mono text-sm break-all">
                  {secret || "Loading..."}
                </div>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">3. Verify Setup</h3>
                  <p className="text-sm text-gray-500">
                    Enter the 6-digit code from your authenticator app to verify setup:
                  </p>
                  <input
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                    verifying || !secret ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={verifying || !secret}
                >
                  {verifying ? "Verifying..." : "Verify & Enable 2FA"}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
          <button
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => navigate("/profile")}
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  )
}

