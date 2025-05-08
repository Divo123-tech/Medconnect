import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  X,
  Upload,
  File,
  ImageIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";

export type FileWithPreview = {
  id: string;
  file: File;
  preview: string;
  progress: number;
  error?: string;
  uploaded?: boolean;
};

type FileUploadProps = {
  files: FileWithPreview[];
  onFilesAdded: (files: FileWithPreview[]) => void;
  onFileRemove: (fileId: string) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedFileTypes?: string[];
};

export default function FileUpload({
  files,
  onFilesAdded,
  onFileRemove,
  maxFiles = 5,
  maxSize = 5, // 5MB default
  acceptedFileTypes = ["application/pdf", "image/jpeg", "image/png"],
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      // Check if adding these files would exceed the max files limit
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload a maximum of ${maxFiles} files.`);
        return;
      }

      const newFiles: (FileWithPreview | null)[] = acceptedFiles.map((file) => {
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
          setError(
            `File ${file.name} is too large. Maximum size is ${maxSize}MB.`
          );
          return null;
        }

        // Create preview for images
        let preview = "";
        if (file.type.startsWith("image/")) {
          preview = URL.createObjectURL(file);
        } else {
          // For non-image files like PDFs, we'll use a generic icon
          preview = "";
        }

        // Simulate upload progress
        const newFile: FileWithPreview = {
          id: "123",
          file,
          preview,
          progress: 0,
        };

        // Simulate upload progress
        simulateFileUpload(newFile);

        return newFile;
      });

      // Filter out any null entries (files that failed validation)
      const validFiles = newFiles.filter(Boolean) as FileWithPreview[];
      if (validFiles.length > 0) {
        onFilesAdded(validFiles);
      }
    },
    [files.length, maxFiles, maxSize, onFilesAdded]
  );

  const simulateFileUpload = (file: FileWithPreview) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        clearInterval(interval);
        progress = 100;

        // Update the file with completed status
        onFilesAdded([
          {
            ...file,
            progress: 100,
            uploaded: true,
          },
        ]);
      } else {
        // Update progress
        onFilesAdded([
          {
            ...file,
            progress,
          },
        ]);
      }
    }, 300);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles,
    disabled: files.length >= maxFiles,
  });

  // Update dragActive state based on isDragActive from useDropzone
  React.useEffect(() => {
    setDragActive(isDragActive);
  }, [isDragActive]);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const getFileTypeLabel = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return fileType.split("/")[1].toUpperCase();
    } else if (fileType === "application/pdf") {
      return "PDF";
    } else {
      return "FILE";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return bytes + " B";
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
  };

  return (
    <div className="w-full space-y-4">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-start"
          >
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
          dragActive
            ? "border-teal-400 bg-teal-50"
            : "border-teal-200 hover:border-teal-300 bg-teal-50/50 hover:bg-teal-50"
        } ${files.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className={`p-3 rounded-full ${
              dragActive
                ? "bg-teal-100 text-teal-600"
                : "bg-teal-100/50 text-teal-500"
            }`}
          >
            <Upload className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-teal-700">
              {files.length >= maxFiles
                ? "Maximum files reached"
                : dragActive
                ? "Drop files here"
                : "Drag and drop files here"}
            </p>
            <p className="text-xs text-teal-500">
              {files.length >= maxFiles
                ? `You've reached the limit of ${maxFiles} files`
                : `PDF, JPG, PNG up to ${maxSize}MB (${files.length}/${maxFiles})`}
            </p>
          </div>
          {files.length < maxFiles && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
            >
              Browse Files
            </Button>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-md border border-teal-200 p-3 shadow-sm"
              >
                <div className="flex items-center">
                  <div className="mr-3 flex-shrink-0">
                    {getFileIcon(file.file.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-teal-900">
                        {file.file.name}
                      </p>
                      <button
                        onClick={() => onFileRemove(file.id)}
                        className="ml-2 flex-shrink-0 text-teal-500 hover:text-teal-700"
                        aria-label="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-teal-500 bg-teal-50 px-2 py-0.5 rounded">
                          {getFileTypeLabel(file.file.type)}
                        </span>
                        <span className="text-xs text-teal-500">
                          {formatFileSize(file.file.size)}
                        </span>
                      </div>
                      {file.uploaded && (
                        <span className="flex items-center text-xs text-emerald-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Uploaded
                        </span>
                      )}
                    </div>
                    {file.progress < 100 && (
                      <div className="mt-2">
                        <Progress
                          value={file.progress}
                          className="h-1.5 bg-teal-100"
                          indicatorClassName="bg-teal-500"
                        />
                        <span className="text-xs text-teal-600 mt-1">
                          {file.progress}% uploaded
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
