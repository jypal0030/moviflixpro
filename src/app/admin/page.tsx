'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [contentStatus, setContentStatus] = useState('');
  const [formData, setFormData] = useState({
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
        setUploadStatus('Upload successful!');
        setFormData(prev => ({
          ...prev,
          posterUrl: result.url
        }));
      } else {
        setUploadStatus('Upload failed: ' + result.error);
      }
    } catch (error) {
      setUploadStatus('Upload failed: ' + error);
    }
  };

  const handleContentSave = async () => {
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
        setContentStatus('Content saved successfully!');
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
      } else {
        setContentStatus('Save failed: ' + result.error);
      }
    } catch (error) {
      setContentStatus('Save failed: ' + error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg">
          <h1 className="text-2xl font-bold text-white mb-4">Admin Login</h1>
          <button 
            onClick={() => setIsLoggedIn(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Login as Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        {/* File Upload Section */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upload Movie Poster</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="mb-4 text-white"
          />
          {uploadStatus && (
            <div className="text-green-400 mb-4">{uploadStatus}</div>
          )}
        </div>

        {/* Content Form Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Add New Content</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            
            <div>
              <label className="block text-white mb-2">Content Type</label>
              <select
                value={formData.contentType}
                onChange={(e) => setFormData({...formData, contentType: e.target.value})}
                className="w-full p-2 rounded bg-gray-700 text-white"
              >
                <option value="MOVIE">Movie</option>
                <option value="WEB_SERIES">Web Series</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white mb-2">Category ID</label>
              <input
                type="text"
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                className="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="action, comedy, drama, etc."
              />
            </div>
            
            <div>
              <label className="block text-white mb-2">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            
            <div>
              <label className="block text-white mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="120 min"
              />
            </div>
            
            <div>
              <label className="block text-white mb-2">Rating</label>
              <input
                type="text"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: e.target.value})}
                className="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="8.0"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-white mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 rounded bg-gray-700 text-white h-24"
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-white mb-2">Poster URL (auto-filled after upload)</label>
            <input
              type="text"
              value={formData.posterUrl}
              onChange={(e) => setFormData({...formData, posterUrl: e.target.value})}
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="https://..."
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-white mb-2">Telegram URL</label>
            <input
              type="text"
              value={formData.telegramUrl}
              onChange={(e) => setFormData({...formData, telegramUrl: e.target.value})}
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="https://t.me/..."
            />
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleContentSave}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Save Content
            </button>
          </div>
          
          {contentStatus && (
            <div className={`mt-4 ${contentStatus.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
              {contentStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}