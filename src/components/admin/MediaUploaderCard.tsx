import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, RefreshCw, AlertTriangle, CheckCircle2, Video, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { MediaSpecification, DEFAULT_MEDIA_SPEC } from '../../constants/mediaSpecs';
import { StorageService } from '../../lib/storage';

interface MediaUploaderCardProps {
  spec?: MediaSpecification;
  currentUrl?: string;
  onUrlChange: (newUrl: string) => void;
  onAutoSave?: (newUrl: string) => Promise<void>;
  onStatusChange?: (status: 'idle' | 'uploading' | 'saving' | 'saved' | 'failed', message?: string) => void;
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
  onAutoSave,
  onStatusChange,
  labelOverride,
  subLabelOverride,
  className = ''
}) => {
  const activeSpec = spec || DEFAULT_MEDIA_SPEC;
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'saving' | 'saved' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [showAdvancedUrl, setShowAdvancedUrl] = useState(false);
  const [manualUrl, setManualUrl] = useState(currentUrl || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastAttemptedFileRef = useRef<File | null>(null);

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
    if (activeSpec.mediaType === 'image') {
      const img = new Image();
      img.onload = () => {
        const ratio = img.naturalWidth / (img.naturalHeight || 1);
        const diff = Math.abs(ratio - activeSpec.ratioValue) / (activeSpec.ratioValue || 1);
        setMetadata({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: `${img.naturalWidth}:${img.naturalHeight}`,
          ratioValue: ratio,
          fileSize: 'Server Asset',
          format: url.split('.').pop()?.toUpperCase().split('?')[0] || 'IMG',
          isRatioMatched: diff <= activeSpec.ratioTolerance,
          ratioDiffPercent: Math.round(diff * 100)
        });
      };
      img.src = url;
    } else if (activeSpec.mediaType === 'video') {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        const ratio = video.videoWidth / (video.videoHeight || 1);
        const diff = Math.abs(ratio - activeSpec.ratioValue) / (activeSpec.ratioValue || 1);
        setMetadata({
          width: video.videoWidth,
          height: video.videoHeight,
          aspectRatio: `${video.videoWidth}:${video.videoHeight}`,
          ratioValue: ratio,
          fileSize: 'Server Video',
          format: url.split('.').pop()?.toUpperCase().split('?')[0] || 'MP4',
          duration: Math.round(video.duration),
          isRatioMatched: diff <= activeSpec.ratioTolerance,
          ratioDiffPercent: Math.round(diff * 100)
        });
      };
      video.src = url;
    }
  };

  const handleFile = async (file: File) => {
    if (!file) return;
    lastAttemptedFileRef.current = file;

    try {
      setUploading(true);
      setUploadStatus('uploading');
      setErrorMessage(null);

      // 1. Measure client-side dimensions & ratio before uploading
      let measuredMeta: Partial<FileMetadata> = {
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        format: file.type.split('/')[1]?.toUpperCase() || file.name.split('.').pop()?.toUpperCase() || ''
      };

      if (activeSpec.mediaType === 'image') {
        const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
          img.onerror = () => resolve({ width: 0, height: 0 });
          img.src = URL.createObjectURL(file);
        });

        const ratio = dimensions.width / (dimensions.height || 1);
        const diff = Math.abs(ratio - activeSpec.ratioValue) / (activeSpec.ratioValue || 1);
        measuredMeta = {
          ...measuredMeta,
          width: dimensions.width,
          height: dimensions.height,
          aspectRatio: `${dimensions.width}:${dimensions.height}`,
          ratioValue: ratio,
          isRatioMatched: diff <= activeSpec.ratioTolerance,
          ratioDiffPercent: Math.round(diff * 100)
        };
      } else if (activeSpec.mediaType === 'video') {
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
        const diff = Math.abs(ratio - activeSpec.ratioValue) / (activeSpec.ratioValue || 1);
        measuredMeta = {
          ...measuredMeta,
          width: vidInfo.width,
          height: vidInfo.height,
          aspectRatio: `${vidInfo.width}:${vidInfo.height}`,
          ratioValue: ratio,
          duration: vidInfo.duration,
          isRatioMatched: diff <= activeSpec.ratioTolerance,
          ratioDiffPercent: Math.round(diff * 100)
        };
      }

      setMetadata(measuredMeta as FileMetadata);

      // Determine target Supabase storage bucket
      let targetBucket: 'hero-images' | 'product-images' | 'hero-videos' | 'category-images' | 'site-assets' = 'product-images';
      if (activeSpec.storageFolder === 'hero') {
        targetBucket = activeSpec.mediaType === 'video' ? 'hero-videos' : 'hero-images';
      } else if (activeSpec.storageFolder === 'collection-banners') {
        targetBucket = 'category-images';
      } else if (activeSpec.storageFolder === 'collection-cards') {
        targetBucket = 'product-images';
      } else if (activeSpec.storageFolder === 'product-videos') {
        targetBucket = 'hero-videos';
      } else if (activeSpec.storageFolder === 'seo' || activeSpec.storageFolder === 'brand' || activeSpec.storageFolder === 'cms') {
        targetBucket = 'site-assets';
      }

      onStatusChange?.('uploading', `Uploading ${activeSpec.label} to Supabase Storage (${targetBucket})...`);

      // 2. Upload to Supabase Storage
      let finalUrl = '';
      let uploadedStoragePath = '';
      let uploadedBucket = targetBucket;

      try {
        const res = await StorageService.uploadToSupabaseStorage(targetBucket, file, '', {
          dimensions: `${activeSpec.recommendedWidth} × ${activeSpec.recommendedHeight} px`,
          aspectRatio: activeSpec.aspectRatio,
          label: activeSpec.label
        });
        finalUrl = res.url;
        uploadedStoragePath = res.storagePath;
        uploadedBucket = (res.bucket as any) || targetBucket;
      } catch (directUploadErr: any) {
        console.warn('Direct Supabase storage upload attempt encountered error, attempting fallback route:', directUploadErr?.message);
        // Fallback to uploadMediaFile
        const category = (activeSpec.storageFolder === 'hero' ? 'homepage-image' :
                          activeSpec.storageFolder === 'collection-banners' ? 'collection-banner' :
                          activeSpec.storageFolder === 'collection-cards' ? 'collection-image' :
                          activeSpec.storageFolder === 'product-videos' ? 'product-video' : 'product-image') as any;
        const res = await StorageService.uploadMediaFile(file, category, [activeSpec.label]);
        finalUrl = res.url;
        uploadedStoragePath = (res as any).storagePath || '';
      }

      if (!finalUrl) {
        throw new Error('Upload completed but returned no valid URL');
      }

      // Assert valid returned URL (No local blob or raw base64 data)
      if (finalUrl.startsWith('blob:')) {
        throw new Error('Temporary blob URL detected. Permanent storage URL required.');
      }

      const previousUrl = currentUrl;

      // 3. If auto-save handler provided, persist database/CMS record BEFORE claiming saved
      if (onAutoSave) {
        setUploadStatus('saving');
        onStatusChange?.('saving', `Saving ${activeSpec.label} to database...`);
        try {
          await onAutoSave(finalUrl);
          // Commit URL to React state ONLY after database persistence is confirmed
          onUrlChange(finalUrl);
          setManualUrl(finalUrl);
        } catch (dbErr: any) {
          // Revert URL to previous active URL
          onUrlChange(previousUrl || '');
          setManualUrl(previousUrl || '');
          // Remove orphaned upload from storage so storage doesn't accumulate failed uploads
          if (uploadedStoragePath && uploadedBucket) {
            StorageService.deleteFromSupabaseStorage(uploadedBucket, uploadedStoragePath).catch(() => {});
          }
          throw new Error(`CMS Save Failed: ${dbErr?.message || 'Database update rejected'}`);
        }
      } else {
        onUrlChange(finalUrl);
        setManualUrl(finalUrl);
      }

      // 4. Success state (Confirmed: BOTH Storage upload + Database persistence succeeded)
      setUploadStatus('saved');
      onStatusChange?.('saved', `${activeSpec.label} saved successfully!`);

      // Reset back to idle after 4 seconds
      setTimeout(() => {
        setUploadStatus('idle');
      }, 4000);
    } catch (err: any) {
      console.error('Media upload & save pipeline error:', err);
      const msg = err?.message || 'Failed to upload and save media';
      setErrorMessage(msg);
      setUploadStatus('failed');
      onStatusChange?.('failed', msg);
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
            {activeSpec.mediaType === 'video' ? <Video className="w-3.5 h-3.5 text-stone-600" aria-hidden="true" /> : <ImageIcon className="w-3.5 h-3.5 text-stone-600" aria-hidden="true" />}
            {labelOverride || activeSpec.label}
          </h4>
          <p className="text-[11px] text-stone-500">
            {subLabelOverride || activeSpec.subLabel || activeSpec.description}
          </p>
        </div>

        {/* Prominent Spec Pill */}
        <div className="inline-flex items-center gap-2 bg-stone-900 text-white px-2.5 py-1 rounded-sm text-[10px] font-mono tracking-tight shrink-0 self-start sm:self-auto">
          <span>{activeSpec.recommendedWidth} × {activeSpec.recommendedHeight} px</span>
          <span className="text-stone-400">•</span>
          <span className="font-semibold text-amber-300">{activeSpec.aspectRatio}</span>
          <span className="text-stone-400">•</span>
          <span className="text-stone-300">{activeSpec.acceptedFormats.join('/')}</span>
          {activeSpec.maxSizeLabel && (
            <>
              <span className="text-stone-400">•</span>
              <span className="text-stone-300">Max {activeSpec.maxSizeLabel}</span>
            </>
          )}
        </div>
      </div>

      {/* Real-time Operation Status Feedback */}
      {uploadStatus !== 'idle' && (
        <div className={`p-2.5 rounded text-xs flex items-center justify-between font-medium animate-in fade-in duration-150 ${
          uploadStatus === 'uploading' ? 'bg-amber-50 border border-amber-200 text-amber-900' :
          uploadStatus === 'saving' ? 'bg-sky-50 border border-sky-200 text-sky-900' :
          uploadStatus === 'saved' ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' :
          'bg-rose-50 border border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-center gap-2">
            {(uploadStatus === 'uploading' || uploadStatus === 'saving') && (
              <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0 text-amber-600" aria-hidden="true" />
            )}
            {uploadStatus === 'saved' && (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
            )}
            {uploadStatus === 'failed' && (
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" aria-hidden="true" />
            )}
            <span>
              {uploadStatus === 'uploading' && `Uploading ${activeSpec.label} to Supabase Storage...`}
              {uploadStatus === 'saving' && `Saving media & updating database records...`}
              {uploadStatus === 'saved' && `Saved: Media uploaded and database records updated successfully.`}
              {uploadStatus === 'failed' && (errorMessage || `Media upload failed. Please try again.`)}
            </span>
          </div>
          {uploadStatus === 'failed' && (
            <div className="flex items-center gap-2 shrink-0">
              {lastAttemptedFileRef.current && (
                <button
                  type="button"
                  onClick={() => {
                    if (lastAttemptedFileRef.current) {
                      handleFile(lastAttemptedFileRef.current);
                    }
                  }}
                  className="px-2 py-0.5 bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-medium rounded-xs cursor-pointer transition-colors"
                >
                  Retry
                </button>
              )}
              <button
                type="button"
                onClick={() => { setUploadStatus('idle'); setErrorMessage(null); }}
                className="p-1 text-rose-700 hover:text-rose-900 text-xs font-semibold underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Upload / Preview Area */}
      {currentUrl ? (
        <div className="space-y-3">
          {/* Media Preview Frame */}
          <div className="relative group bg-stone-900 rounded-md overflow-hidden border border-stone-300">
            {activeSpec.mediaType === 'video' ? (
              <video
                src={currentUrl}
                controls
                className="w-full max-h-56 object-contain mx-auto"
              />
            ) : (
              <img
                src={currentUrl}
                alt={labelOverride || activeSpec.label}
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
                <RefreshCw className={`w-3 h-3 ${uploading ? 'animate-spin' : ''}`} aria-hidden="true" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 bg-rose-600/90 hover:bg-rose-600 text-white rounded shadow-md cursor-pointer transition-colors"
                title="Remove Media"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Dimension & Validation Badge */}
          {metadata && (
            <div className={`p-2.5 rounded-md text-xs flex items-start gap-2 ${
              metadata.isRatioMatched ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-amber-50 border border-amber-200 text-amber-900'
            }`}>
              {metadata.isRatioMatched ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
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
                    ✓ Recommended {activeSpec.aspectRatio} canvas ratio matched perfectly.
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-800">
                    ⚠ Recommended ratio is <strong>{activeSpec.aspectRatio}</strong> ({activeSpec.recommendedWidth} × {activeSpec.recommendedHeight} px). 
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
              <Upload className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <button
                type="button"
                disabled={uploading}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : <Upload className="w-3.5 h-3.5" aria-hidden="true" />}
                <span>{uploading ? 'Uploading to Supabase...' : 'Upload From PC'}</span>
              </button>
              <p className="text-[11px] text-stone-500 mt-1.5">
                or drag and drop your {activeSpec.mediaType} file here
              </p>
            </div>
            <div className="text-[10px] text-stone-400 font-mono pt-1">
              Canvas: {activeSpec.recommendedWidth} × {activeSpec.recommendedHeight} px ({activeSpec.aspectRatio}) • {activeSpec.acceptedFormats.join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={activeSpec.mediaType === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp'}
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
          {showAdvancedUrl ? <ChevronUp className="w-3 h-3" aria-hidden="true" /> : <ChevronDown className="w-3 h-3" aria-hidden="true" />}
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
