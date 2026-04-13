import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { healthVideos } from '../../data/mockData';
import { Play, Pause, X, Download, Clock, WifiOff } from 'lucide-react';

export default function HealthVideos() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(healthVideos.map(v => v.category)))];
  const filtered = filter === 'All' ? healthVideos : healthVideos.filter(v => v.category === filter);

  const playingVideo = healthVideos.find(v => v.id === playing);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar title="Health Videos" />
      <div className="max-w-lg mx-auto px-4 py-5">

        {/* Offline badge */}
        <div className="animate-fade-in flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 mb-4">
          <WifiOff size={14} className="text-emerald-600" />
          <span className="text-xs text-emerald-700 font-medium">Videos available offline</span>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video grid */}
        <div className="space-y-3 animate-fade-in">
          {filtered.map(video => (
            <button
              key={video.id}
              onClick={() => setPlaying(video.id)}
              className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center gap-4 p-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-3xl shrink-0 relative">
                  {video.thumbnail}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity">
                    <Play size={20} className="text-white" fill="white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm">{video.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{video.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> {video.duration}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{video.category}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                    <Play size={16} className="text-emerald-600 ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Video Player Modal */}
        {playing && playingVideo && (
          <div className="fixed inset-0 bg-black/80 z-50 flex flex-col animate-fade-in">
            <div className="flex items-center justify-between p-4">
              <h3 className="text-white font-bold truncate flex-1">{playingVideo.title}</h3>
              <button
                onClick={() => setPlaying(null)}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white ml-3"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center px-4">
              <div className="w-full max-w-md aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                <div className="text-7xl mb-3">{playingVideo.thumbnail}</div>
                <p className="text-white/70 text-sm">{playingVideo.title}</p>

                {/* Simulated controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-4">
                  <div className="h-1 bg-white/30 rounded-full mb-3">
                    <div className="h-1 bg-emerald-400 rounded-full w-1/3" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-xs">1:15 / {playingVideo.duration}</span>
                    <div className="flex items-center gap-3">
                      <button className="text-white">
                        <Pause size={20} />
                      </button>
                    </div>
                    <button className="text-white/70">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <p className="text-white/60 text-sm text-center">{playingVideo.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
