'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  onLoad?: () => void;
}

interface VideoItem {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: string;
  views: number;
  uploaded: string;
}

export default function VideoPlayer({ onLoad }: VideoPlayerProps) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const categories = ['all', 'edukimi', 'teknologji', 'lojëra', 'muzikë', 'udhëtime'];

  // Generate  videos
  useEffect(() => {
    const timer = setTimeout(() => {
      const videoData: VideoItem[] = [
        {
          id: 1,
          title: 'Hyrje në Inteligjencën Artificiale',
          description: 'Një prezantim i plotë mbi bazat e AI dhe aplikacionet e saj.',
          thumbnail: 'https://picsum.photos/320/180?=101',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket//BigBuckBunny.mp4',
          duration: '10:45',
          category: 'edukimi',
          views: 12500,
          uploaded: '2 ditë më parë'
        },
        {
          id: 2,
          title: 'React dhe TypeScript - Tutorial',
          description: 'Mëso të përdorësh React me TypeScript për projekte moderne.',
          thumbnail: 'https://picsum.photos/320/180?=102',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket//ElephantsDream.mp4',
          duration: '25:30',
          category: 'teknologji',
          views: 8900,
          uploaded: '1 javë më parë'
        },
        {
          id: 3,
          title: 'Arkitektura Moderne Shqiptare',
          description: 'Eksplorimi i zhvillimeve të fundit në arkitekturën e Shqipërisë.',
          thumbnail: 'https://picsum.photos/320/180?=103',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket//ForBiggerBlazes.mp4',
          duration: '15:20',
          category: 'edukimi',
          views: 5600,
          uploaded: '3 ditë më parë'
        },
        {
          id: 4,
          title: 'Muzikë Tradicionale Ballkanike',
          description: 'Koleksion i këngëve të vjetra tradicionale nga Ballkani.',
          thumbnail: 'https://picsum.photos/320/180?=104',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket//ForBiggerEscapes.mp4',
          duration: '45:15',
          category: 'muzikë',
          views: 15200,
          uploaded: '5 ditë më parë'
        },
        {
          id: 5,
          title: 'Udhëtim nëpër Alpe Shqiptare',
          description: 'Tur virtual në malet më të bukura të Shqipërisë.',
          thumbnail: 'https://picsum.photos/320/180?=105',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket//ForBiggerFun.mp4',
          duration: '32:08',
          category: 'udhëtime',
          views: 22100,
          uploaded: '1 muaj më parë'
        },
        {
          id: 6,
          title: 'Gaming në Shqipëri - Të ardhmat',
          description: 'Si po zhvillohet industria e lojërave në vendin tonë.',
          thumbnail: 'https://picsum.photos/320/180?=106',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket//ForBiggerJoyrides.mp4',
          duration: '18:45',
          category: 'lojëra',
          views: 7800,
          uploaded: '2 javë më parë'
        }
      ];
      
      setVideos(videoData);
      setSelectedVideo(videoData[0] ?? null);
      setIsLoading(false);
      onLoad?.();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onLoad]);

  const filteredVideos = videos.filter(video => 
    selectedCategory === 'all' || video.category === selectedCategory
  );

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    videoRef.current?.play();
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    videoRef.current?.pause();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Duke ngarkuar videot...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Video Player */}
      <div className="lg:col-span-2 space-y-4">
        {selectedVideo && (
          <motion.div
            key={selectedVideo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black rounded-lg overflow-hidden shadow-xl"
          >
            <div className="relative aspect-video">
              <video
                ref={videoRef}
                className="w-full h-full"
                controls
                poster={selectedVideo.thumbnail}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
              >
                <source src={selectedVideo.videoUrl} type="video/mp4" />
                Shfletuesi juaj nuk mbështet luajtjen e videove.
              </video>
              
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <button
                    onClick={handleVideoPlay}
                    className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l8-5-8-5z"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Video Info */}
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold mb-3">{selectedVideo.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                👁️ {formatViews(selectedVideo.views)} shikime
              </span>
              <span className="flex items-center gap-1">
                🕒 {selectedVideo.uploaded}
              </span>
              <span className="flex items-center gap-1">
                ⏱️ {selectedVideo.duration}
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {selectedVideo.category}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">{selectedVideo.description}</p>
          </motion.div>
        )}
      </div>

      {/* Video List */}
      <div className="space-y-4">
        {/* Category Filter */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold mb-3">📂 Kategoritë</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Të gjithë' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Video Thumbnails */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold">🎬 Lista e Videove</h3>
            <p className="text-sm text-gray-600">{filteredVideos.length} video</p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <AnimatePresence>
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 border-b cursor-pointer transition-colors ${
                    selectedVideo?.id === video.id
                      ? 'bg-red-50 border-red-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {video.title}
                      </h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>{formatViews(video.views)} shikime</p>
                        <p>{video.uploaded}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Player Stats */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="font-semibold mb-3">📊 Statistikat</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Videot:</span>
              <span className="font-semibold">{videos.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Të filtruara:</span>
              <span className="font-semibold">{filteredVideos.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Po luhet:</span>
              <span className="font-semibold">{isPlaying ? 'Po' : 'Jo'}</span>
            </div>
            <div className="flex justify-between">
              <span>Video aktuale:</span>
              <span className="font-semibold">{selectedVideo?.id || 'Asnjë'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

