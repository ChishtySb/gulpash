import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, RefreshCw, AlertTriangle, CheckCircle2, Video, Image as ImageIcon, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { MediaSpecification } from '../../constants/mediaSpecs';
import { StorageService } from '../../lib/storage';

interface MediaUploaderCardProps {
  spec: MediaSpecification;
  currentUrl?: string;
  onUrlChange: (newUrl: string) => void;
  labelOverride?: string;
  subLabelOverride?: string;
  className?: string;
}

interface FileMetadata {
  width: number;
  height: number;
  aspectRatio: string;
  ratioValue: number;
  fileSize: string;
  format: string;
  duration?: number; // for video in seconds
  isRatioMatched: boolean;
  ratioDiffPercent: number;
}

export const MediaUploaderCard: React.FC<MediaUploaderCardProps> = ({
  spec,
  currentUrl,
  onUrlChange,
  labelOverride,
  subLabelOverride,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [showAdvancedUrl, setShowAdvancedUrl] = useState(false);
  const [manualUrl, setManualUrl] = useState(currentUrl || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setManualUrl(currentUrl || '');
    if (currentUrl) {
      inspectExistingMedia(currentUrl);
    } else {
      setMetadata(null);
    }
  }, [currentUrl]);

  // Inspect existing media to derive dimensions
  const inspectExistingMedia = (url: string) => {
    if (spec.mediaType === 'image') {
      const img = new Image();
      img.onload = () => {
        const ratio = img.naturalWidth / (img.naturalHeight || 1);
        const diff = Math.abs(ratio - spec.ratioValue) / spec.ratioValue;
        setMetadata({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: `${img.naturalWidth}:${img.naturalHeight}`,
          ratioValue: ratio,
          fileSize: 'Server Asset',
          format: url.split('.').pop()?.toUpperCase().split('?')[0] || 'IMG',
          isRatioMatched: diff <= spec.ratioTolerance,
          ratioDiffPercent: Math.round(diff * 100)
        });
      };
      img.src = url;
    } else if (spec.mediaType === 'video') {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        const ratio = video.videoWidth / (video.videoHeight || 1);
        const diff = Math.abs(ratio - spec.ratioValue) / spec.ratioValue;
        setMetadata({
          width: video.videoWidth,
          height: video.videoHeight,
          aspectRatio: `${video.videoWidth}:${video.videoHeight}`,
          ratioValue: ratio,
          fileSize: 'Server Video',
          format: url.split('.').pop()?.toUpperCase().split('?')[0] || 'MP4',
          duration: Math.round(video.duration),
          isRatioMatched: diff <= spec.ratioTolerance,
          ratioDiffPercent: Math.round(diff * 100)
        });
      };
      video.src = url;
    }
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);

      // Measure client-side dimensions & ratio before uploading
      let measuredMeta: Partial<FileMetadata> = {
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        format: file.type.split('/')[1]?.toUpperCase() || file.name.split('.').pop()?.toUpperCase() || ''
      };

      if (spec.mediaType === 'image') {
        const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
          img.onerror = () => resolve({ width: 0, height: 0 });
          img.src = URL.createObjectURL(file);
        });

        const ratio = dimensions.width / (dimensions.height || 1);
        const diff = Math.abs(ratio - spec.ratioValue) / spec.ratioValue;
        measuredMeta = {
          ...measuredMeta,
          width: dimensions.width,
          height: dimensions.height,
          aspectRatio: `${dimensions.width}:${dimensions.height}`,
          ratioValue: ratio,
          isRatioMatched: diff <= spec.ratioTolerance,
          ratioDiffPercent: Math.round(diff * 100)
        };
      } else if (spec.mediaType === 'video') {
        const vidInfo = await new Promise<{ width: number; height: number; duration: number }>((resolve) => {
          const video = document.createElement('video');
          video.onloadedmetadata = () => resolve({
            width: video.videoWidth,
            height: video.videoHeight,
            duration: Math.round(video.duration)
          });
          video.onerror = () => resolve({ width: 0, height: 0, duration: 0 });
          video.src = URL.createObjectURL(file);
        });

        const ratio = vidInfo.width / (vidInfo.height || 1);
        const diff = Math.abs(ratio - spec.ratioValue) / spec.ratioValue;
        measuredMeta = {
          ...measuredMeta,
          width: vidInfo.width,
          height: vidInfo.height,
          aspectRatio: `${vidInfo.width}:${vidInfo.height}`,
          ratioValue: ratio,
          duration: vidInfo.duration,
          isRatioMatched: diff <= spec.ratioTolerance,
          ratioDiffPercent: Math.round(diff * 100)
        };
      }

      setMetadata(measuredMeta as FileMetadata);

      // Upload permanently to Supabase Storage via StorageService
      const category = (spec.storageFolder === 'hero' ? 'homepage-image' :
                        spec.storageFolder === 'collection-banners' ? 'collection-banner' :
                        spec.storageFolder === 'collection-cards' ? 'collection-image' :
                        spec.storageFolder === 'product-videos' ? 'product-video' : 'product-image') as any;

      const res = await StorageService.uploadMediaFile(file, category, [spec.label]);
      if (res.url) {
        onUrlChange(res.url);
        setManualUrl(res.url);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(`Failed to upload media: ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onUrlChange('');
    setManualUrl('');
    setMetadata(null);
  };

  return (
    <div className={`p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-3 ${className}`}>
      {/* Header & Specs Guidance */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-2 border-b border-stone-200">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            {spec.mediaType === 'video' ? <Video className="w-3.5 h-3.5 text-stone-600" /> : <ImageIcon className="w-3.5 h-3.5 text-stone-600" />}
            {labelOverride || spec.label}
          </h4>
          <p className="text-[11px] text-stone-500">
            {subLabelOverride || spec.subLabel || spec.description}
          </p>
        </div>

        {/* Prominent Spec Pill */}
        <div className="inline-flex items-center gap-2 bg-stone-900 text-white px-2.5 py-1 rounded-sm text-[10px] font-mono tracking-tight shrink-0 self-start sm:self-auto">
          <span>{spec.recommendedWidth} × {spec.recommendedHeight} px</span>
          <span className="text-stone-400">•</span>
          <span className="font-semibold text-amber-300">{spec.aspectRatio}</span>
          <span className="text-stone-400">•</span>
          <span className="text-stone-300">{spec.acceptedFormats.join('/')}</span>
        </div>
      </div>

      {/* Main Upload / Preview Area */}
      {currentUrl ? (
        <div className="space-y-3">
          {/* Media Preview Frame */}
          <div className="relative group bg-stone-900 rounded-md overflow-hidden border border-stone-300">
            {spec.mediaType === 'video' ? (
              <video
                src={currentUrl}
                controls
                className="w-full max-h-56 object-contain mx-auto"
              />
            ) : (
              <img
                src={currentUrl}
                alt={labelOverride || spec.label}
                className="w-full max-h-56 object-contain mx-auto bg-stone-950"
              />
            )}

            {/* Quick Action Overlay */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-2.5 py-1 bg-white/90 hover:bg-white text-stone-900 rounded text-[11px] font-semibold flex items-center gap-1 shadow-md cursor-pointer transition-colors"
                title="Replace from PC"
              >
                <RefreshCw className={`w-3 h-3 ${uploading ? 'animate-spin' : ''}`} />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 bg-rose-600/90 hover:bg-rose-600 text-white rounded shadow-md cursor-pointer transition-colors"
                title="Remove Media"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dimension & Validation Badge */}
          {metadata && (
            <div className={`p-2.5 rounded-md text-xs flex items-start gap-2 ${
              metadata.isRatioMatched ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-amber-50 border border-amber-200 text-amber-900'
            }`}>
              {metadata.isRatioMatched ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>
                    Uploaded: <strong>{metadata.width} × {metadata.height} px</strong> (Ratio ~{(metadata.ratioValue).toFixed(2)}:1)
                  </span>
                  <span>{metadata.format} • {metadata.fileSize} {metadata.duration ? `• ${metadata.duration}s` : ''}</span>
                </div>
                {metadata.isRatioMatched ? (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Recommended {spec.aspectRatio} canvas ratio matched perfectly.
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-800">
                    ⚠ Recommended ratio is <strong>{spec.aspectRatio}</strong> ({spec.recommendedWidth} × {spec.recommendedHeight} px). 
                    The storefront container will preserve presentation via object-cover, which may crop outer edges.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
            isDragOver 
              ? 'border-amber-500 bg-amber-50/50' 
              : 'border-stone-300 hover:border-stone-400 bg-white'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <button
                type="button"
                disabled={uploading}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{uploading ? 'Uploading to Supabase...' : 'Upload From PC'}</span>
              </button>
              <p className="text-[11px] text-stone-500 mt-1.5">
                or drag and drop your {spec.mediaType} file here
              </p>
            </div>
            <div className="text-[10px] text-stone-400 font-mono pt-1">
              Canvas: {spec.recommendedWidth} × {spec.recommendedHeight} px ({spec.aspectRatio}) • {spec.acceptedFormats.join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={spec.mediaType === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp'}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Advanced / External URL Collapsible Option */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvancedUrl(!showAdvancedUrl)}
          className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer font-medium"
        >
          {showAdvancedUrl ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          <span>{showAdvancedUrl ? 'Hide' : 'Show'} Advanced / External URL Override</span>
        </button>

        {showAdvancedUrl && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://... or /products/..."
              className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded text-xs font-mono text-stone-800 focus:outline-hidden focus:border-stone-900"
            />
            <button
              type="button"
              onClick={() => {
                onUrlChange(manualUrl.trim());
                if (manualUrl.trim()) inspectExistingMedia(manualUrl.trim());
              }}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded text-xs font-semibold cursor-pointer"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
