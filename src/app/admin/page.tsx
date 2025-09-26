'use client';

import { useState, useEffect } from 'react';
import { MemoryStorage } from '@/lib/storage';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  year: number;
  duration: string;
  rating: number;
  quality: string;
  telegramUrl: string;
  contentType: 'MOVIE' | 'WEB_SERIES';
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [contentStatus, setContentStatus] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'manage' | 'settings'>('dashboard');
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalSeries: 0,
    totalCategories: 0,
    recentUploads: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'MOVIE' as 'MOVIE' | 'WEB_SERIES',
    categoryId: '',
    posterUrl: '',
    year: '',
    duration: '',
    rating: '',
    quality: 'HD',
    telegramUrl: ''
  });

  // Load content and stats
  useEffect(() => {
    if (isLoggedIn) {
      loadContent();
      updateStats();
    }
  }, [isLoggedIn]);

  const loadContent = () => {
    const storage = MemoryStorage.getInstance();
    const allContent = storage.getAllContent();
    setContentList(allContent);
  };

  const updateStats = () => {
    const storage = MemoryStorage.getInstance();
    const allContent = storage.getAllContent();
    
    const movies = allContent.filter(item => item.contentType === 'MOVIE');
    const series = allContent.filter(item => item.contentType === 'WEB_SERIES');
    const categories = [...new Set(allContent.map(item => item.categoryId))];
    const recentUploads = allContent.filter(item => {
      const uploadDate = new Date(item.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return uploadDate > weekAgo;
    });

    setStats({
      totalMovies: movies.length,
      totalSeries: series.length,
      totalCategories: categories.length,
      recentUploads: recentUploads.length
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('Uploading...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus('✅ Upload successful!');
        setFormData(prev => ({
          ...prev,
          posterUrl: result.url
        }));
      } else {
        setUploadStatus('❌ Upload failed: ' + result.error);
      }
    } catch (error) {
      setUploadStatus('❌ Upload failed: ' + error);
    }
  };

  const handleContentSave = async () => {
    if (!formData.title || !formData.description) {
      setContentStatus('❌ Title and description are required!');
      return;
    }

    setContentStatus('Saving...');

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setContentStatus('✅ Content saved successfully!');
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          contentType: 'MOVIE',
          categoryId: '',
          posterUrl: '',
          year: '',
          duration: '',
          rating: '',
          quality: 'HD',
          telegramUrl: ''
        });

        // Reload content and update stats
        setTimeout(() => {
          loadContent();
          updateStats();
          setContentStatus('');
        }, 1000);

      } else {
        setContentStatus('❌ Save failed: ' + result.error);
      }
    } catch (error) {
      setContentStatus('❌ Save failed: ' + error);
    }
  };

  const deleteContent = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      const storage = MemoryStorage.getInstance();
      const updatedContent = contentList.filter(item => item.id !== id);
      // Note: This is a simple implementation. In a real app, you'd update the storage
      setContentList(updatedContent);
      updateStats();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎬</div>
            <h1 className="text-3xl font-bold text-white mb-2">MoviFlixPro Admin</h1>
            <p className="text-gray-300">Premium Content Management System</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <label className="block text-white mb-2">Username</label>
              <input
                type="text"
                placeholder="admin"
                className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none"
              />
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg">
              <label className="block text-white mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none"
              />
            </div>
            
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
            >
              🔐 Login to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">🎬</div>
              <div>
                <h1 className="text-2xl font-bold text-white">MoviFlixPro Admin</h1>
                <p className="text-gray-400 text-sm">Content Management Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-white font-semibold">Admin User</div>
                <div className="text-gray-400 text-sm">Online</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex space-x-1">
            {[
              { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              { id: 'add', label: '➕ Add Content', icon: '➕' },
              { id: 'manage', label: '🎬 Manage Content', icon: '🎬' },
              { id: 'settings', label: '⚙️ Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Movies', value: stats.totalMovies, icon: '🎬', color: 'from-blue-600 to-cyan-600' },
              { label: 'Web Series', value: stats.totalSeries, icon: '📺', color: 'from-green-600 to-emerald-600' },
              { label: 'Categories', value: stats.totalCategories, icon: '🏷️', color: 'from-purple-600 to-pink-600' },
              { label: 'Recent Uploads', value: stats.recentUploads, icon: '📈', color: 'from-orange-600 to-red-600' }
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                    <div className="text-3xl font-bold text-white mt-2">{stat.value}</div>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* File Upload Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">📤</span> Upload Poster
              </h2>
              
              <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-white/50 transition-colors">
                <div className="text-6xl mb-4">🖼️</div>
                <p className="text-gray-300 mb-4">Drag & drop your poster here</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  Choose File
                </label>
              </div>
              
              {uploadStatus && (
                <div className={`mt-4 p-3 rounded-lg ${
                  uploadStatus.includes('✅') ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                }`}>
                  {uploadStatus}
                </div>
              )}
              
              {formData.posterUrl && (
                <div className="mt-6">
                  <p className="text-gray-300 mb-2">Preview:</p>
                  <img
                    src={formData.posterUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Content Form Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">🎬</span> Content Details
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">🎭 Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none"
                      placeholder="Enter movie title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">🎭 Type</label>
                    <select
                      value={formData.contentType}
                      onChange={(e) => setFormData({...formData, contentType: e.target.value as any})}
                      className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none"
                    >
                      <option value="MOVIE">🎬 Movie</option>
                      <option value="WEB_SERIES">📺 Web Series</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">🏷️ Category</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none"
                    >
                      <option value="">Select category...</option>
                      <option value="action">🔫 Action</option>
                      <option value="comedy">😄 Comedy</option>
                      <option value="drama">🎭 Drama</option>
                      <option value="horror">👻 Horror</option>
                      <option value="romance">💕 Romance</option>
                      <option value="thriller">😰 Thriller</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">📅 Year</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none"
                      placeholder="2024"
                      min="1900"
                      max="2030"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">⏱️ Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none"
                      placeholder="120 min"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">⭐ Rating</label>
                    <input
                      type="number"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: e.target.value})}
                      className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none"
                      placeholder="8.0"
                      min="0"
                      max="10"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white mb-2">📝 Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none h-24 resize-none"
                    placeholder="Enter content description..."
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">🔗 Telegram URL</label>
                  <input
                    type="url"
                    value={formData.telegramUrl}
                    onChange={(e) => setFormData({...formData, telegramUrl: e.target.value})}
                    className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none"
                    placeholder="https://t.me/..."
                  />
                </div>
                
                <button
                  onClick={handleContentSave}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
                >
                  💾 Save Content
                </button>
                
                {contentStatus && (
                  <div className={`p-3 rounded-lg ${
                    contentStatus.includes('✅') ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                  }`}>
                    {contentStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">🎬</span> Manage Content ({contentList.length} items)
            </h2>
            
            {contentList.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-400 text-lg">No content found. Add some content to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentList.map((item) => (
                  <div key={item.id} className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2 truncate">{item.title}</h3>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{item.year} • {item.duration}</span>
                        <span>⭐ {item.rating}</span>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button className="flex-1 bg-blue-600/20 text-blue-400 py-1 rounded text-sm hover:bg-blue-600/30">
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteContent(item.id)}
                          className="flex-1 bg-red-600/20 text-red-400 py-1 rounded text-sm hover:bg-red-600/30"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">⚙️</span> General Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Site Title</label>
                  <input
                    type="text"
                    defaultValue="MoviFlixPro"
                    className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Site Description</label>
                  <textarea
                    defaultValue="Premium Movie Streaming Platform"
                    className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none h-20 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Items per page</label>
                  <select className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none">
                    <option>12</option>
                    <option>24</option>
                    <option>48</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">🔐</span> Security Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Enable Admin Login</div>
                    <div className="text-gray-400 text-sm">Require authentication for admin access</div>
                  </div>
                  <div className="w-12 h-6 bg-green-600 rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Enable Upload</div>
                    <div className="text-gray-400 text-sm">Allow file uploads in admin panel</div>
                  </div>
                  <div className="w-12 h-6 bg-green-600 rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}