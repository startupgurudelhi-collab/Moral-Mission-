import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (dataUrlOrPath: string) => void;
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto';
  helperText?: string;
  presets?: { label: string; url: string }[];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = 'Upload Image',
  value,
  onChange,
  aspectRatio = 'auto',
  helperText = 'PNG, JPG, WEBP, or SVG from your computer (auto-optimized)',
  presets,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Compress & convert file to data URL
  const processFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const src = e.target?.result as string;

      // If SVG or small image, store directly
      if (file.type === 'image/svg+xml' || file.size < 400 * 1024) {
        onChange(src);
        setIsProcessing(false);
        return;
      }

      // Optimize large photos via Canvas to prevent localStorage overflow
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1600;
        const maxHeight = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onChange(compressedDataUrl);
        } else {
          onChange(src);
        }
        setIsProcessing(false);
      };

      img.onerror = () => {
        onChange(src);
        setIsProcessing(false);
      };

      img.src = src;
    };

    reader.onerror = () => {
      setIsProcessing(false);
      alert('Failed to read image file.');
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700">
            {label}
          </label>
          {value && (
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Image Loaded
            </span>
          )}
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        // Preview + Change/Remove Controls
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-3">
          <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center min-h-[140px] max-h-[220px]">
            <img
              src={value}
              alt="Uploaded visual"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain max-h-[200px]"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-xs gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Optimizing image...</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New Photo</span>
            </button>

            {presets && presets.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                {showPresets ? 'Hide Library' : 'NGO Library'}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onChange('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Remove image"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        // Dropzone & Upload Button Area
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/70 scale-[0.99]'
              : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50/80 bg-white'
          }`}
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 shadow-xs">
            {isProcessing ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>

          <div className="text-xs font-bold text-slate-800">
            Click to upload photo from your device
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            or drag and drop your image file here
          </p>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">
            {helperText}
          </p>
        </div>
      )}

      {/* Optional Preset Selector */}
      {showPresets && presets && presets.length > 0 && (
        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
          <span className="text-[11px] font-semibold text-slate-700 block">
            Select from NGO Pre-approved High-Res Library:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setShowPresets(false);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
