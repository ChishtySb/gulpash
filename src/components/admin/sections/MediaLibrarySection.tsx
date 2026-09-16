import React, { useState } from 'react';
import { 
  Image as ImageIcon, Upload, Search, Copy, Check, 
  Trash2, ExternalLink, Filter, Sparkles, Folder,
  Video, Eye, RefreshCw, AlertCircle
} from 'lucide-react';
import { MediaAsset } from '../../../types';
import { StorageService } from '../../../lib/storage';
import { MEDIA_SPECS, MediaSpecification } from '../../../constants/mediaSpecs';
import { MediaUploaderCard } from '../MediaUploaderCard';

interface MediaLibrarySectionProps {
  onNotify: (msg: string, status?: 'saving' | 'saved' | 'failed') => void;
}

export const MediaLibrarySection: React.FC<MediaLibrarySectionProps> = ({ onNotify }) => {
  const [assets, setAssets] = useState<MediaAsset[]>(() => StorageService.getMediaAssets());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSpecKey, setSelectedSpecKey] = useState<string>('PRODUCT_IMAGE');
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  const refreshList = () => {
    setAssets(StorageService.getMediaAssets());
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    onNotify('Media URL copied to clipboard!');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this media asset from the library?')) {
      StorageService.deleteMediaAsset(id);
      refreshList();
      onNotify('Media asset deleted.');
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.usedIn && asset.usedIn.some(u => u.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = categoryFilter === 'all' ? true : asset.category === categoryFilter;
    const matchesType = typeFilter === 'all' ? true : asset.mediaType === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const activeSpec = MEDIA_SPECS[selectedSpecKey] || MEDIA_SPECS.PRODUCT_IMAGE;

  return (
    <div className="space-y-6 font-sans">
      {/* 1. HEADER & ACTIONS */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest bg-stone-100 text-stone-800 font-mono font-bold px-2 py-0.5 rounded">
              CENTRAL MEDIA MANAGEMENT
            </span>
            <span className="text-xs text-stone-400 font-mono">
              {assets.length} Total Assets
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            Storefront Media Library
          </h2>
          <p className="text-xs text-stone-500">
            Upload, preview, and inspect studio photos, hero banners, and runway videos formatted strictly according to aspect ratio specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshList}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md border border-stone-200"
            title="Refresh assets"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload From PC</span>
          </button>
        </div>
      </div>

      {/* 2. MEDIA SPECIFICATIONS QUICK GUIDE */}
      <div className="bg-stone-900 text-white rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-sm font-bold flex items-center gap-2 text-stone-100">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>GulPash Media Aspect Ratio Specifications</span>
          </h3>
          <span className="text-[10px] font-mono text-stone-400">
            Auto-validated during upload
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-[11px]">
          <div className="p-2.5 bg-stone-800/80 rounded border border-stone-700/60">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Hero Desktop</span>
            <span className="font-mono text-amber-300 font-bold block mt-0.5">1920 × 1080</span>
            <span className="text-stone-400 text-[10px]">16:9 Landscape</span>
          </div>
          <div className="p-2.5 bg-stone-800/80 rounded border border-stone-700/60">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Hero Mobile</span>
            <span className="font-mono text-amber-300 font-bold block mt-0.5">1080 × 1350</span>
            <span className="text-stone-400 text-[10px]">4:5 Portrait</span>
          </div>
          <div className="p-2.5 bg-stone-800/80 rounded border border-stone-700/60">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Col. Banner</span>
            <span className="font-mono text-amber-300 font-bold block mt-0.5">1920 × 600</span>
            <span className="text-stone-400 text-[10px]">16:5 Panorama</span>
          </div>
          <div className="p-2.5 bg-stone-800/80 rounded border border-stone-700/60">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Col. Card</span>
            <span className="font-mono text-amber-300 font-bold block mt-0.5">1200 × 1500</span>
            <span className="text-stone-400 text-[10px]">4:5 Portrait</span>
          </div>
          <div className="p-2.5 bg-stone-800/80 rounded border border-stone-700/60">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Product Photo</span>
            <span className="font-mono text-amber-300 font-bold block mt-0.5">1200 × 1500</span>
            <span className="text-stone-400 text-[10px]">4:5 Studio Portrait</span>
          </div>
          <div className="p-2.5 bg-stone-800/80 rounded border border-stone-700/60">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Runway Video</span>
            <span className="font-mono text-amber-300 font-bold block mt-0.5">1080 × 1350</span>
            <span className="text-stone-400 text-[10px]">4:5 Loop / MP4</span>
          </div>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH */}
      <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by filename or where used..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-stone-900"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-md">
            {['all', 'image', 'video'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t as any)}
                className={`px-2.5 py-1 rounded text-xs font-medium uppercase transition-colors cursor-pointer ${
                  typeFilter === t ? 'bg-white shadow-xs text-stone-900' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {['all', 'product-image', 'collection-image', 'collection-banner', 'homepage-image'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-md font-medium text-xs whitespace-nowrap transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {cat === 'all' ? 'All Folders' : cat.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. ASSET GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredAssets.map((asset) => (
          <div 
            key={asset.id} 
            className="group bg-white border border-stone-200 rounded-lg overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="relative aspect-4/5 bg-stone-100 overflow-hidden">
              {asset.mediaType === 'video' ? (
                <video
                  src={asset.url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  loop
                />
              ) : (
                <img
                  src={asset.url}
                  alt={asset.fileName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              )}

              {/* Top Badges */}
              <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                {asset.mediaType === 'video' && (
                  <span className="p-1 rounded bg-black/70 text-white">
                    <Video className="w-3 h-3" />
                  </span>
                )}
                <span className="text-[9px] font-mono bg-black/60 backdrop-blur-xs text-white px-1.5 py-0.5 rounded">
                  {asset.dimensions || asset.aspectRatio}
                </span>
              </div>

              {/* Hover Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <button
                  type="button"
                  onClick={() => setPreviewAsset(asset)}
                  className="p-2 bg-white/90 hover:bg-white text-stone-900 rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                  title="Preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(asset.id, asset.url)}
                  className="p-2 bg-white/90 hover:bg-white text-stone-900 rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                  title="Copy URL"
                >
                  {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(asset.id)}
                  className="p-2 bg-white/90 hover:bg-rose-50 text-rose-600 rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Meta Footer */}
            <div className="p-2.5 text-[11px] space-y-1">
              <p className="font-medium text-stone-800 truncate" title={asset.fileName}>
                {asset.fileName}
              </p>
              <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                <span>{asset.fileSize || '350 KB'}</span>
                <span>{asset.aspectRatio || '4:5'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. UPLOAD MODAL FROM PC */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">Upload Media Asset</span>
                <h3 className="font-serif text-lg font-bold text-stone-900">Upload to Media Library</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-stone-400 hover:text-stone-900 text-xl"
              >
                &times;
              </button>
            </div>

            {/* Select Target Placement Specification */}
            <div className="space-y-1.5 text-xs">
              <label className="block font-bold text-stone-800">
                Target Media Placement & Aspect Ratio Spec:
              </label>
              <select
                value={selectedSpecKey}
                onChange={(e) => setSelectedSpecKey(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded bg-stone-50 font-medium"
              >
                {Object.entries(MEDIA_SPECS)
                  .filter(([_, spec], index, self) => self.findIndex(([, s]) => s.id === spec.id) === index)
                  .map(([k, spec]) => (
                    <option key={k} value={k}>
                      {spec.label} ({spec.recommendedWidth} × {spec.recommendedHeight} px, {spec.aspectRatio})
                    </option>
                  ))}
              </select>
            </div>

            {/* Media Uploader Card */}
            <MediaUploaderCard
              spec={activeSpec}
              onUrlChange={(url) => {
                refreshList();
                setShowUploadModal(false);
                onNotify('Asset uploaded to Media Library!', 'saved');
              }}
              onStatusChange={(status, msg) => {
                if (status === 'uploading' || status === 'saving') {
                  onNotify(msg || 'Uploading asset to Media Library...', 'saving');
                } else if (status === 'saved') {
                  onNotify(msg || 'Asset uploaded to Media Library!', 'saved');
                } else if (status === 'failed') {
                  onNotify(msg || 'Failed to upload asset', 'failed');
                }
              }}
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. PREVIEW MODAL */}
      {previewAsset && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in" onClick={() => setPreviewAsset(null)}>
          <div className="relative max-w-2xl w-full bg-stone-950 rounded-lg overflow-hidden p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-white border-b border-stone-800 pb-2">
              <span className="font-mono text-xs">{previewAsset.fileName}</span>
              <button onClick={() => setPreviewAsset(null)} className="text-stone-400 hover:text-white text-xl">
                &times;
              </button>
            </div>

            <div className="max-h-[70vh] flex items-center justify-center bg-black rounded">
              {previewAsset.mediaType === 'video' ? (
                <video src={previewAsset.url} controls autoPlay className="max-h-[65vh] w-auto rounded" />
              ) : (
                <img src={previewAsset.url} alt={previewAsset.fileName} className="max-h-[65vh] w-auto object-contain rounded" />
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-300 pt-2 border-t border-stone-800">
              <span className="font-mono text-[11px]">{previewAsset.dimensions} • {previewAsset.fileSize}</span>
              <button
                onClick={() => handleCopy(previewAsset.id, previewAsset.url)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white text-black font-medium rounded text-xs hover:bg-stone-200 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Direct Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
