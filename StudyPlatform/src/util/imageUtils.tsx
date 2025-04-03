"use client"

import axios from "axios"
import React, { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"

/**
 * A component that displays an image with authentication support for backend resources
 */
export const CORSImage: React.FC<{
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  width?: number
  height?: number
}> = ({ src, alt, className, style, width, height }) => {
  const { token } = useAuth()
  const [hasError, setHasError] = useState<boolean>(false)
  const [imageSrc, setImageSrc] = useState<string>(src)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Extract initials for the fallback
  const initials = alt
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2)

  useEffect(() => {
    // Reset states when src changes
    setHasError(false)
    setIsLoading(true)
    setImageSrc(src)

    // Skip processing if src is empty or null
    if (!src) {
      setHasError(true)
      setIsLoading(false)
      return
    }

    // For backend images, try to fetch with token
    const isBackendImage =
      src &&
      (src.includes("localhost:8080") || src.startsWith("/api/")) &&
      !src.startsWith("data:") &&
      !src.startsWith("blob:")

    if (isBackendImage) {
      // Try to fetch the image with axios
      const fetchImage = async () => {
        try {
          console.log(`Fetching image: ${src}`)

          // Ensure the URL is absolute
          const fullUrl = src.startsWith("http") ? src : `http://localhost:8080${src.startsWith("/") ? src : `/${src}`}`

          // Try with authentication first
          const config = token
            ? {
                responseType: "blob" as const,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            : {
                responseType: "blob" as const,
              }

          const response = await axios.get(fullUrl, config)

          // Create a blob URL from the response
          const blob = new Blob([response.data], {
            type: response.headers["content-type"] || "image/jpeg",
          })
          const objectUrl = URL.createObjectURL(blob)

          console.log(`Successfully loaded image: ${src}`)
          setImageSrc(objectUrl)
          setIsLoading(false)
        } catch (error) {
          console.error(`Error fetching image: ${src}`, error)

          // Try with a direct img tag as fallback
          console.log(`Falling back to direct image loading for: ${src}`)
          setIsLoading(false)
        }
      }

      fetchImage()
    } else {
      // For non-backend images, just mark as loaded
      setIsLoading(false)
    }

    // Cleanup function to revoke object URLs
    return () => {
      if (imageSrc && imageSrc.startsWith("blob:")) {
        URL.revokeObjectURL(imageSrc)
      }
    }
  }, [src, token])

  if (isLoading) {
    return (
      <div
        className={`img-placeholder ${className || ""}`}
        style={{
          width: width || 40,
          height: height || 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
          color: "#6c757d",
          fontWeight: "bold",
          borderRadius: "50%",
          ...style,
        }}
      >
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      </div>
    )
  }

  if (hasError) {
    return (
      <div
        className={`img-placeholder ${className || ""}`}
        style={{
          width: width || 40,
          height: height || 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
          color: "#6c757d",
          fontWeight: "bold",
          borderRadius: "50%",
          ...style,
        }}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={imageSrc || "/placeholder.svg"}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      onError={() => {
        console.log(`Error loading image: ${imageSrc}`)
        setHasError(true)
      }}
    />
  )
}

