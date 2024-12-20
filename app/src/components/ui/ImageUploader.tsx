import React, { useCallback, useState } from 'react';

type ImageUploaderProps = {
  id?: string;
  className?: string;
  multiple?: boolean;
  errors: string[] | null;
  onChange: (files: File[]) => void;
  value: File[] | undefined;
  disabled?: boolean;
  accept?: string;
  ref: React.Ref<HTMLInputElement>
};

export default function ImageUploader({
  className, errors, multiple = true, onChange, value = [], ref, ...props
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((newFiles: FileList | null) => {
    if (!newFiles || !onChange) return;
    // Convert FileList to File array and combine with existing files if multiple
    const fileArray = Array.from(newFiles);
    const newFileList = multiple ? [...value, ...fileArray] : fileArray;
    // The controller component, directly updates the form state with the newFileList value
    onChange(newFileList);
  }, [multiple, onChange, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      handleFileChange(files);
    }
  };

  const removeFile = (indexToRemove: number) => {
    if (!onChange) return;
    const newFiles = value.filter((_, index) => index !== indexToRemove);
    onChange(newFiles);
  };

  return (
    <>
      <div className="flex flex-col">
        <label htmlFor={props.id ?? 'images'} className="mb-1 text-sm font-medium">
          Images {multiple && '(Max 10)'}
        </label>
        <div
          className={`flex items-center justify-center w-full ${className}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label
            htmlFor={props.id ?? 'images'}
            className={`flex flex-col items-center justify-center w-full h-32 
              border-2 border-dashed rounded-lg cursor-pointer 
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`
            }
          >
            <div className="flex flex-col items-center justify-center p-3">
              <svg className="w-6 h-6 mb-2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                   fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-xs text-gray-500">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">Max File Size: 250KB</p>
            </div>
            <input
              {...props}
              ref={ref} id={props.id ?? 'images'} type="file" accept="image/*" multiple={multiple} className="hidden"
              onChange={handleInputChange} />
          </label>
        </div>
      </div>

      {/* Preview section */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((file, index) => (
            <div key={`${file.name}-${index}`} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${file.name}`}
                className="w-20 h-20 object-cover"
                onLoad={(e) => {
                  URL.revokeObjectURL((e.target as HTMLImageElement).src);
                }}
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="remove-image-button"
                aria-label="Remove image"
              >x</button>
            </div>
          ))}
        </div>
      )}

      {/* Error messages */}
      {errors && errors.map((error, i) => (
        <div
          className="text-red-500 text-sm"
          key={error.replace(/\s+/g, '').substring(0, 5) + i}
          role="alert"
        >
          {error}
        </div>
      ))}
    </>
  );
}
