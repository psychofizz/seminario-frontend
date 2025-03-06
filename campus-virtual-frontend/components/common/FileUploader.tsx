// components/common/FileUploader.tsx
'use client';

import { useState, useRef } from 'react';

type FileUploaderProps = {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  accept?: string;
  maxSize?: number; // in MB
};

export default function FileUploader({ 
  onFileSelect, 
  isUploading = false, 
  accept = '*',
  maxSize = 10 // Default 10MB
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`El archivo es demasiado grande. El tamaño máximo es ${maxSize}MB.`);
      return false;
    }
    
    // Check file type if accept is specified
    if (accept !== '*') {
      const fileType = file.type;
      const acceptedTypes = accept.split(',').map(type => type.trim());
      
      // Check if the file extension is acceptable
      const fileExtension = '.' + file.name.split('.').pop();
      const isAcceptedExtension = acceptedTypes.some(type => {
        // Handle mime types vs extensions
        return type.startsWith('.') 
          ? fileExtension.toLowerCase() === type.toLowerCase()
          : type.includes('/') 
            ? fileType === type
            : true; // For types like 'image/*'
      });
      
      if (!isAcceptedExtension) {
        setError(`Tipo de archivo no permitido. Los tipos aceptados son: ${accept}`);
        return false;
      }
    }
    
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragActive(false);
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  };

  return (
    <div className="mb-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center 
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={selectedFile ? undefined : handleButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={accept}
          disabled={isUploading}
        />
        
        {selectedFile ? (
          <div>
            <div className="flex items-center justify-center mb-4">
              <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <p className="text-gray-800 font-medium mb-1">{selectedFile.name}</p>
            <p className="text-gray-500 text-sm mb-4">{formatFileSize(selectedFile.size)}</p>
            
            <div className="flex justify-center space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                onClick={clearFile}
                disabled={isUploading}
              >
                Eliminar
              </button>
              
              <button
                type="button"
                className={`px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center
                  ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}
                `}
                onClick={handleSubmit}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subiendo...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Subir
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center items-center mb-4">
              <svg className="h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-8m-12 0H8a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Arrastra y suelta</span> tu archivo aquí, o <span className="font-medium text-blue-600">haz clic</span> para seleccionarlo
            </p>
            <p className="text-xs text-gray-500">
              {accept === '*' ? 'Todos los tipos de archivo permitidos' : `Tipos permitidos: ${accept}`} (Tamaño máximo: {maxSize}MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
}