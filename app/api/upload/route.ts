import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Optional: Get user email if authenticated (for better tracking)
    const { data: { user } } = await supabase.auth.getUser()
    const userEmail = user?.email || 'guest'

    const uploadPromises = files.map(async (file, index) => {
      // Generate unique filename with user context for security
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2)
      const fileExt = file.name.split('.').pop() || 'jpg'
      const fileName = `${timestamp}-${randomId}-${index}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('keycutonline')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw new Error(`Upload failed: ${error.message}`)
      }

      // Generate signed URL that expires in 7 days for security
      const { data: signedUrlData } = await supabase.storage
        .from('keycutonline')
        .createSignedUrl(data.path, 7 * 24 * 60 * 60) // 7 days

      return {
        path: data.path,
        signedUrl: signedUrlData?.signedUrl,
        filename: fileName,
        originalName: file.name,
        size: file.size,
        uploadedBy: userEmail
      }
    })

    const results = await Promise.all(uploadPromises)

    return NextResponse.json({
      uploads: results,
      message: "Files uploaded successfully"
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
