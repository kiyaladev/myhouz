'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface LightboxImage {
  url: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex = 0, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset index when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        setIsZoomed(false);
        break;
      case 'ArrowRight':
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        setIsZoomed(false);
        break;
    }
  }, [isOpen, images.length, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsZoomed(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-4">
          <span className="text-sm">
            {currentIndex + 1} / {images.length}
          </span>
          {currentImage.caption && (
            <span className="text-sm text-gray-300 hidden sm:block">
              {currentImage.caption}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleZoom}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title={isZoomed ? 'Dézoomer' : 'Zoomer'}
          >
            {isZoomed ? (
              <ZoomOut className="w-5 h-5" />
            ) : (
              <ZoomIn className="w-5 h-5" />
            )}
          </button>
          <a
            href={currentImage.url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Télécharger"
          >
            <Download className="w-5 h-5" />
          </a>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Previous button */}
        {images.length > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            title="Image précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Image */}
        <div 
          className={`relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={toggleZoom}
        >
          <img
            src={currentImage.url}
            alt={currentImage.caption || `Image ${currentIndex + 1}`}
            className={`max-h-[calc(100vh-180px)] transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={{ maxWidth: isZoomed ? 'none' : '90vw' }}
          />
        </div>

        {/* Next button */}
        {images.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            title="Image suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="p-4 overflow-x-auto">
          <div className="flex justify-center gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsZoomed(false);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === idx
                    ? 'border-emerald-500 opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.caption || `Miniature ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Caption for mobile */}
      {currentImage.caption && (
        <div className="p-4 text-center text-white text-sm sm:hidden">
          {currentImage.caption}
        </div>
      )}
    </div>
  );
}
