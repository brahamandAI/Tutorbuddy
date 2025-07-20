import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
}

export const ImageUpload = ({ onUpload }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        aria-label="Upload image"
      />
      <button
        type="button"
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        onClick={() => inputRef.current?.click()}
      >
        Upload Image
      </button>
      {preview && (
        <img src={preview} alt="Preview" className="max-h-32 rounded border mt-2" />
      )}
    </div>
  );
}; 