import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, ArrowRight } from 'lucide-react';
import { HeroSlideConfig } from '../../types';

interface HeroSectionProps {
  config: HeroSlideConfig;
  onNavigate: (view: string, param?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ config, onNavigate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (config.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy prevented playback, video will remain paused or muted
      });
    }
  }, [config.type, config.videoUrl]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handlePrimaryClick = () => {
    if (config.buttonUrl?.startsWith('/collections/')) {
      const slug = config.buttonUrl.replace('/collections/', '');
      onNavigate('collection', slug);
    } else if (config.buttonUrl?.startsWith('/categories/')) {
      const slug = config.buttonUrl.replace('/categories/', '');
      onNavigate('category', slug);
    } else {
      onNavigate('collection', 'best-selling');
    }
  };

  const handleSecondaryClick = () => {
    if (config.secondaryButtonUrl?.startsWith('/collections/')) {
      const slug = config.secondaryButtonUrl.replace('/collections/', '');
      onNavigate('collection', slug);
    } else if (config.secondaryButtonUrl?.startsWith('/categories/')) {
      const slug = config.secondaryButtonUrl.replace('/categories/', '');
      onNavigate('category', slug);
    } else {
      onNavigate('shop');
    }
  };

  const primaryButtonLabel = config.buttonText === 'EXPLORE BEST SELLERS' 
    ? 'EXPLORE TRENDING' 
    : (config.buttonText || 'EXPLORE TRENDING');
  const secondaryButtonLabel = config.secondaryButtonText || 'SHOP ALL';

  return (
    <section className="relative w-full h-[75vh] sm:h-[85vh] lg:h-[90vh] overflow-hidden bg-[#181818] flex items-center justify-center font-sans">
      
      {/* 1. MEDIA BACKGROUND (VIDEO OR IMAGE) */}
      {config.type === 'video' && config.videoUrl ? (
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            src={config.videoUrl}
            poster={config.posterImageUrl || config.desktopImageUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Fallback image if video is loading */}
          {!videoLoaded && (
            <img
              src={config.posterImageUrl || config.desktopImageUrl}
              alt={config.heading}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Sound Toggle Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-6 right-6 z-20 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white p-2.5 rounded-full border border-white/20 transition-all cursor-pointer"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            title={isMuted ? 'Play Sound' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full">
          {/* Desktop Image */}
          <picture>
            {config.mobileImageUrl && (
              <source media="(max-width: 640px)" srcSet={config.mobileImageUrl} />
            )}
            <img
              src={config.desktopImageUrl}
              alt={config.heading}
              className="w-full h-full object-cover object-top animate-fade-in"
            />
          </picture>
        </div>
      )}

      {/* 2. DYNAMIC OVERLAY (Controlled by overlayOpacity) */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
        style={{ opacity: (config.overlayOpacity ?? 35) / 100 }}
      />
      
      {/* Subtle bottom gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* 3. HERO EDITORIAL CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white flex flex-col items-center">
        
        {/* Collection Badge */}
        {config.badge && (
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-stone-200 text-[10px] uppercase tracking-[0.3em] font-medium py-1.5 px-4 rounded-full mb-4 sm:mb-6 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-stone-300" />
            <span>{config.badge}</span>
          </div>
        )}

        {/* Main Heading */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light italic tracking-wider leading-tight sm:leading-none text-white drop-shadow-md">
          {config.heading}
        </h1>

        {/* Subheading */}
        <p className="mt-3 sm:mt-5 text-xs sm:text-sm md:text-base text-stone-200 max-w-2xl font-light tracking-wide leading-relaxed drop-shadow-xs">
          {config.subheading}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-9 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <button
            id="hero-primary-cta"
            onClick={handlePrimaryClick}
            className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white text-[11px] uppercase tracking-[0.25em] font-medium py-3.5 px-8 border border-stone-700 shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{primaryButtonLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {secondaryButtonLabel && (
            <button
              id="hero-secondary-cta"
              onClick={handleSecondaryClick}
              className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white border border-white/40 hover:border-white text-[11px] uppercase tracking-[0.25em] font-medium py-3.5 px-8 backdrop-blur-xs transition-all duration-200 cursor-pointer"
            >
              {secondaryButtonLabel}
            </button>
          )}
        </div>

      </div>

      {/* Decorative luxury marker */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] text-white/60 tracking-[0.3em] uppercase">
        <span className="w-8 h-px bg-white/40" />
        <span>GULPASH COUTURE</span>
        <span className="w-8 h-px bg-white/40" />
      </div>

    </section>
  );
};
