import React from "react"
import { useAuth } from "../contexts/AuthContext"

export default function Home() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold">Welcome, {user.firstName}!</h1>
        <p className="text-gray-500">This is your personal dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold">Profile Overview</h3>
            <p className="text-sm text-gray-500">Your personal information</p>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl || "/placeholder.svg"}
                    alt={user.firstName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-medium text-gray-700">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-medium">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                {user.using2FA && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                    2FA Enabled
                  </span>
                )}
              </div>
            </div>

            {user.bio && (
              <div className="mt-4">
                <h4 className="text-sm font-medium">Bio</h4>
                <p className="mt-1 text-sm text-gray-500">{user.bio}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold">Academic Interests</h3>
            <p className="text-sm text-gray-500">Your areas of study</p>
          </div>
          <div className="p-6">
            {user.academicInterests && user.academicInterests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.academicInterests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No academic interests added yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold">Account Security</h3>
            <p className="text-sm text-gray-500">Your security settings</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                  <p className="text-xs text-gray-500">Enhance your account security</p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.using2FA ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.using2FA ? "Enabled" : "Disabled"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Password</h4>
                  <p className="text-xs text-gray-500">Last updated: Never</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Change
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

