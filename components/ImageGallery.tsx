'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ImageGalleryProps {
  onLoad?: () => void;
}

interface ImageItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  loaded: boolean;
}

export default function ImageGallery({ onLoad }: ImageGalleryProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const categories = ['all', 'natyrë', 'teknologji', 'arkitekturë', 'art'];

  // Generate placeholder images
  useEffect(() => {
    const timer = setTimeout(() => {
      const imageData: ImageItem[] = Array.from({ length: 24 }, (_, i) => ({
        id: i + 1,
        src: `https://picsum.photos/300/200?random=${i + 1}`,
        alt: `Imazh ${i + 1}`,
        title: `Titull i Imazhit ${i + 1}`,
        category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
        loaded: false,
      }));
      setImages(imageData);
      setIsLoading(false);
      onLoad?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onLoad]);

  // Lazy loading with Intersection Observer
  const imageRef = useCallback((node: HTMLImageElement | null) => {
    if (isLoading) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const actualSrc = img.dataset.src;
          if (actualSrc && !img.src.includes('picsum')) {
            img.src = actualSrc;
            img.onload = () => {
              setImages(prev => prev.map(item => 
                item.id === parseInt(img.dataset.id || '0') 
                  ? { ...item, loaded: true }
                  : item
              ));
            };
            observerRef.current?.unobserve(img);
          }
        }
      });
    });
    
    if (node) observerRef.current.observe(node);
  }, [isLoading]);

  const filteredImages = images.filter(img => 
    selectedCategory === 'all' || img.category === selectedCategory
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Duke krijuar galerinë e imazheve...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'Të gjithë' : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <div className="aspect-w-3 aspect-h-2 bg-gray-200">
              <img
                ref={imageRef}
                data-src={image.src}
                data-id={image.id.toString()}
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af'%3EDuke ngarkuar...%3C/text%3E%3C/svg%3E"
                alt={image.alt}
                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                  image.loaded ? 'opacity-100' : 'opacity-70'
                }`}
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
              <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="font-semibold text-sm">{image.title}</h4>
                <p className="text-xs opacity-80">{image.category}</p>
              </div>
            </div>

            {/* Loading indicator */}
            {!image.loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="max-w-4xl max-h-full bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
              <p className="text-gray-600 mb-4">Kategoria: {selectedImage.category}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>ID: {selectedImage.id}</span>
                <span>Status: {selectedImage.loaded ? 'E ngarkuar' : 'Duke ngarkuar...'}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Gallery Stats */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-semibold mb-2">📊 Statistikat e Galerisë</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{images.length}</div>
            <div className="text-gray-600">Total Imazhe</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {images.filter(img => img.loaded).length}
            </div>
            <div className="text-gray-600">Të ngarkuara</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{filteredImages.length}</div>
            <div className="text-gray-600">Të filtruara</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{categories.length - 1}</div>
            <div className="text-gray-600">Kategori</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
