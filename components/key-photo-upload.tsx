"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface KeyPhotoUploadProps {
  photoUrls: string[]
  onPhotosChange: (urls: string[]) => void
  maxPhotos?: number
}

export function KeyPhotoUpload({ photoUrls, onPhotosChange, maxPhotos = 4 }: KeyPhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const { uploads } = await response.json()

      if (!uploads || !Array.isArray(uploads)) {
        throw new Error("Invalid upload response")
      }

      // Extract signed URLs from the response
      const signedUrls = uploads.map(upload => upload.signedUrl).filter(Boolean)
      onPhotosChange([...photoUrls, ...signedUrls].slice(0, maxPhotos))
    } catch (error) {
      console.error("[v0] Upload error:", error)
      alert("Failed to upload photos. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const removePhoto = (index: number) => {
    onPhotosChange(photoUrls.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {photoUrls.map((url, index) => (
          <div key={index} className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <Image src={url || "/placeholder.svg"} alt={`Key photo ${index + 1}`} fill className="object-cover" />
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => removePhoto(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {photoUrls.length < maxPhotos && (
        <div>
          <input
            type="file"
            accept="image/*"
            multiple={maxPhotos > 1}
            onChange={handleFileChange}
            className="hidden"
            id="photo-upload"
            disabled={isUploading}
          />
          <label htmlFor="photo-upload">
            <Button type="button" variant="outline" className="w-full bg-transparent" disabled={isUploading} asChild>
              <span>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photos ({photoUrls.length}/{maxPhotos})
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>
      )}
    </div>
  )
}
