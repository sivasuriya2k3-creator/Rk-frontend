import { useState, useRef } from 'react';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface DragDropUploadProps {
  label: string;
  description?: string;
  acceptedFormats: string[];
  maxSize?: number; // in bytes
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  value?: File[];
  disabled?: boolean;
  type?: 'resume' | 'photo';
}

export const DragDropUpload: React.FC<DragDropUploadProps> = ({
  label,
  description,
  acceptedFormats,
  maxSize = 5 * 1024 * 1024, // 5MB default
  multiple = false,
  onFilesSelected,
  value = [],
  disabled = false,
  type = 'resume',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFiles = (files: FileList | null): File[] => {
    if (!files) return [];
    
    const validFiles: File[] = [];
    setError('');

    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > maxSize) {
        setError(`File "${file.name}" is too large. Maximum size is ${formatFileSize(maxSize)}`);
        return;
      }

      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedFormats.includes(fileExtension)) {
        setError(`File type "${fileExtension}" is not allowed. Accepted: ${acceptedFormats.join(', ')}`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      onFilesSelected(multiple ? validFiles : [validFiles[0]]);
    }

    return validFiles;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    validateFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const files = e.target.files;
    validateFiles(files);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onFilesSelected(newFiles);
    setError('');
  };

  const isPhoto = type === 'photo';

  return (
    <div className="w-full">
      <label className="text-xs md:text-sm font-medium mb-2 block">{label}</label>

      {/* Drag Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 md:p-8 text-center cursor-pointer transition-all duration-200',
          isDragging && !disabled
            ? 'border-accent/60 bg-accent/10'
            : 'border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-muted/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          accept={acceptedFormats.join(',')}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2 md:gap-3">
          {isPhoto ? (
            <ImageIcon className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
          ) : (
            <Upload className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
          )}

          <div>
            <p className="text-sm md:text-base font-medium text-foreground">
              {isDragging ? 'Drop your file here' : 'Drag and drop your file here'}
            </p>
            {description && (
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              or <span className="text-accent font-semibold">click to select</span>
            </p>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Max size: {formatFileSize(maxSize)} • Formats: {acceptedFormats.join(', ')}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mt-3">
          <AlertDescription className="text-xs md:text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* File Preview */}
      {value && value.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs md:text-sm font-medium text-muted-foreground">
            {multiple ? `${value.length} file(s) selected:` : 'File selected:'}
          </p>
          <div className="space-y-2">
            {value.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 md:gap-3 p-2 md:p-3 bg-muted rounded-lg border border-muted-foreground/20"
              >
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  {isPhoto ? (
                    <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-accent flex-shrink-0" />
                  ) : (
                    <File className="w-4 h-4 md:w-5 md:h-5 text-accent flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="p-1 hover:bg-muted-foreground/20 rounded transition-colors flex-shrink-0"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;
