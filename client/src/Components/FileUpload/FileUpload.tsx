import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  X,
  Upload,
  ImageIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/Components/ui/button";
import { MedicalDocument } from "@/utils/types";

export type FileWithPreview = {
  file: File;
  preview: string;
};

type FileUploadProps = {
  files: MedicalDocument[];
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
  const getOriginalFileName = (fileName: string): string => {
    return fileName.includes("_")
      ? fileName.substring(fileName.indexOf("_") + 1)
      : fileName;
  };

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
          file,
          preview,
        };

        // Simulate upload progress
        // simulateFileUpload(newFile);
        console.log("newFile", newFile);
        // onFilesAdded([newFile]);
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

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (extension == "pdf") {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else {
      return <ImageIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  const getFileTypeLabel = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return extension?.toUpperCase();
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
                  <div className="mr-3 flex-shrink-0">{getFileIcon("pdf")}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-teal-900">
                        {getOriginalFileName(file.fileName)}
                      </p>
                      <button
                        onClick={() => onFileRemove(String(file.id))}
                        className="ml-2 flex-shrink-0 text-teal-500 hover:text-teal-700"
                        aria-label="Remove file"
                      >
                        <X className="h-4 w-4 cursor-pointer" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-teal-500 bg-teal-50 px-2 py-0.5 rounded">
                          {getFileTypeLabel("pdf")}
                        </span>
                      </div>
                      <span className="flex items-center text-xs text-emerald-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Uploaded
                      </span>
                    </div>
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
