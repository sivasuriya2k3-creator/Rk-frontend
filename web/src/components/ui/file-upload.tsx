import { useCallback, useState } from 'react';
import { Upload, X, FileVideo, FileImage, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  accept?: string;
  maxSize?: number; // in MB
  preview?: string;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  accept = "image/*,video/*,audio/*,.pdf,.doc,.docx,.psd,.ai,.fig",
  maxSize = 100, // 100MB default
  preview,
  className
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [fileType, setFileType] = useState<'image' | 'video' | 'other'>('other');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndSetFile = useCallback((file: File) => {
    setError("");
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Determine file type
    if (file.type.startsWith('image/')) {
      setFileType('image');
    } else if (file.type.startsWith('video/')) {
      setFileType('video');
    } else {
      setFileType('other');
    }

    setSelectedFileName(file.name);
    onFileSelect(file);
  }, [maxSize, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  }, [validateAndSetFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  }, [validateAndSetFile]);

  const handleRemove = useCallback(() => {
    setSelectedFileName("");
    setError("");
    setFileType('other');
    onFileRemove();
  }, [onFileRemove]);

  const getFileIcon = () => {
    if (fileType === 'image') return <FileImage className="w-8 h-8 text-accent" />;
    if (fileType === 'video') return <FileVideo className="w-8 h-8 text-accent" />;
    return <File className="w-8 h-8 text-accent" />;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {!preview && !selectedFileName ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer",
            isDragging
              ? "border-accent bg-accent/10 scale-105"
              : "border-border hover:border-accent hover:bg-accent/5"
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              "p-4 rounded-full transition-all duration-300",
              isDragging ? "bg-accent/20" : "bg-accent/10"
            )}>
              <Upload className={cn(
                "w-8 h-8 transition-all duration-300",
                isDragging ? "text-accent scale-110" : "text-accent/70"
              )} />
            </div>
            
            <div>
              <p className="text-lg font-medium mb-1">
                {isDragging ? "Drop your file here" : "Drag & drop your file here"}
              </p>
              <p className="text-sm text-muted-foreground mb-2">or click to browse</p>
              <p className="text-xs text-muted-foreground">
                Supports: Images, Videos, Audio, PDF, PSD, AI, Figma (max {maxSize}MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative border-2 border-border rounded-lg p-4 bg-accent/5">
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {preview && fileType === 'image' ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : preview && fileType === 'video' ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <video
                src={preview}
                controls
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {getFileIcon()}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{selectedFileName}</p>
                <p className="text-sm text-muted-foreground">Ready to upload</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
