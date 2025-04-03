"use client"

import React from "react"
import { CORSImage } from "../util/imageUtils"

interface ProfileImageProps {
  src?: string | null
  alt: string
  size?: number
  className?: string
  style?: React.CSSProperties
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src, alt, size = 40, className = "", style = {} }) => {
  // We don't need to use token directly in this component
  // The CORSImage component will handle authentication
  const initials = alt
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2)

  // If no source provided, show initials
  if (!src) {
    return (
      <div
        className={`rounded-circle bg-light d-flex align-items-center justify-content-center ${className}`}
        style={{
          width: size,
          height: size,
          ...style,
        }}
      >
        <span className="fw-medium text-secondary">{initials}</span>
      </div>
    )
  }

  // For profile images, use the CORSImage component
  return (
    <div
      className={`rounded-circle overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        ...style,
      }}
    >
      <CORSImage
        src={src}
        alt={alt}
        className="w-100 h-100"
        style={{ objectFit: "cover" }}
        width={size}
        height={size}
      />
    </div>
  )
}

export default ProfileImage

