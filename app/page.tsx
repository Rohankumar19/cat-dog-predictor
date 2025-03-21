"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, ImageIcon, CheckCircle, AlertCircle, Loader2, FolderOpen } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Maximum file size: 25MB in bytes
const MAX_FILE_SIZE = 25 * 1024 * 1024
const ACCEPTED_FILE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
}

export default function PetPredictionPage() {
  const { toast } = useToast()
  const [image, setImage] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<number | null>(null)

  // Simulate file upload with progress
  const simulateUpload = (file: File) => {
    setUploadStatus("uploading")
    setUploadProgress(0)

    const totalSteps = 10
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      setUploadProgress(Math.round((currentStep / totalSteps) * 100))

      if (currentStep === totalSteps) {
        clearInterval(interval)
        setUploadStatus("success")

        // Create object URL after successful upload
        const imageUrl = URL.createObjectURL(file)
        setImage(imageUrl)
        setPrediction(null) // Reset prediction when new image is uploaded

        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded successfully.`,
        })
      }
    }, 200)
  }

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Reset previous errors
      setErrorMessage(null)

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors[0].code === "file-too-large") {
          setErrorMessage(`File is too large. Maximum size is 25MB.`)
          setUploadStatus("error")
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: "File is too large. Maximum size is 25MB.",
          })
        } else if (rejection.errors[0].code === "file-invalid-type") {
          setErrorMessage(`Invalid file type. Please upload an image (JPG, PNG, GIF, WEBP).`)
          setUploadStatus("error")
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: "Invalid file type. Please upload an image (JPG, PNG, GIF, WEBP).",
          })
        } else {
          setErrorMessage(`Upload failed: ${rejection.errors[0].message}`)
          setUploadStatus("error")
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: rejection.errors[0].message,
          })
        }
        return
      }

      // Handle accepted files
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setFileName(file.name)
        setFileSize(file.size)

        // Simulate upload process
        simulateUpload(file)
      }
    },
    [toast],
  )

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    noClick: true, // Disable click to open file dialog (we'll use a button instead)
  })

  const handlePredict = async () => {
    if (!image) return

    setIsLoading(true)

    // Simulate prediction delay
    setTimeout(() => {
      // Mock prediction result - in a real app, this would be an API call
      const result = Math.random() > 0.5 ? "Dog" : "Cat"
      setPrediction(result)
      setIsLoading(false)
    }, 1500)
  }

  // Format file size to human-readable format
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return ""
    if (bytes < 1024) return bytes + " bytes"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  return (
    <AuroraBackground className="p-4">
      <div className="max-w-md w-full mx-auto">
        <Card className="bg-white dark:bg-zinc-800 shadow-lg border-2 border-purple-200 dark:border-purple-900 rounded-xl overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center text-blue-500 mb-6">Dog and Cat prediction</h1>

            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-lg p-6 mb-6 text-center transition-colors
                ${isDragActive && isDragAccept ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""}
                ${isDragActive && isDragReject ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""}
                ${!isDragActive && uploadStatus === "error" ? "border-red-500" : ""}
                ${!isDragActive && uploadStatus === "success" ? "border-green-500" : ""}
                ${!isDragActive && uploadStatus === "idle" ? "border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600" : ""}
              `}
            >
              <input {...getInputProps()} />

              {uploadStatus === "uploading" && (
                <div className="flex flex-col items-center justify-center h-48">
                  <Loader2 className="h-12 w-12 text-blue-500 mb-4 animate-spin" />
                  <p className="text-blue-500 mb-2">Uploading {fileName}...</p>
                  <div className="w-full max-w-xs mb-2">
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                  <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
                </div>
              )}

              {uploadStatus === "error" && (
                <div className="flex flex-col items-center justify-center h-48">
                  <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                  <p className="text-red-500 font-medium">{errorMessage}</p>
                  <p className="text-sm text-gray-500 mt-2">Please try again with a valid image file under 25MB</p>
                </div>
              )}

              {uploadStatus === "success" && image && (
                <div className="relative w-full h-48">
                  <div className="absolute top-2 right-2 z-10 bg-green-100 dark:bg-green-900 rounded-full p-1">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <Image src={image || "/placeholder.svg"} alt="Uploaded pet" fill className="object-contain" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1">
                    {fileName} ({formatFileSize(fileSize)})
                  </div>
                </div>
              )}

              {uploadStatus === "idle" && (
                <div className="flex flex-col items-center justify-center h-48">
                  {isDragActive ? (
                    <>
                      {isDragAccept ? (
                        <>
                          <Upload className="h-12 w-12 text-green-500 mb-2" />
                          <p className="text-green-500">Drop the image here</p>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                          <p className="text-red-500">This file type is not accepted</p>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">Drag and Drop your image here</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 mb-4">
                        Accepted formats: JPG, PNG, GIF, WEBP (max 25MB)
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* File upload button - always visible except during upload */}
              {uploadStatus !== "uploading" && (
                <Button type="button" onClick={open} variant="outline" className="mt-2">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Select Image
                </Button>
              )}
            </div>

            {/* File information display */}
            {fileName && fileSize && uploadStatus === "success" && (
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                <p>File: {fileName}</p>
                <p>Size: {formatFileSize(fileSize)}</p>
              </div>
            )}

            {prediction && (
              <div className="bg-yellow-300 p-3 rounded-md mb-6 text-center font-bold">RESULT: {prediction}</div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={handlePredict}
                disabled={!image || isLoading || uploadStatus === "uploading" || uploadStatus === "error"}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Predict"
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <Toaster />
    </AuroraBackground>
  )
}

