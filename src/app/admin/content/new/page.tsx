'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Film, 
  Tv, 
  Upload,
  X,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/custom-select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ImageUpload from '@/components/ImageUpload';

interface Category {
  id: string;
  name: string;
  slug: string;
  contentType: 'MOVIE' | 'WEB_SERIES';
}

export default function AddNewContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    posterUrl: '',
    year: '',
    duration: '',
    rating: '',
    quality: '',
    telegramUrl: '',
    contentType: 'MOVIE' as 'MOVIE' | 'WEB_SERIES',
    categoryId: ''
  });

  useEffect(() => {
    fetchCategories();
    
    // Check for type parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    if (type === 'MOVIE' || type === 'WEB_SERIES') {
      setFormData(prev => ({ ...prev, contentType: type }));
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Content created successfully! 🎉');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create content');
      }
    } catch (error) {
      console.error('Error creating content:', error);
      alert('An error occurred while creating content');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredCategories = categories.filter(cat => cat.contentType === formData.contentType);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mr-4 text-gray-700 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-bold text-gray-800">Add New Content</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Website
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">
              {message}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-800">Basic Information</CardTitle>
              <CardDescription className="text-gray-600">
                Enter the basic details for your movie or web series
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                    placeholder="Enter title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentType" className="text-gray-700">Content Type *</Label>
                  <Select 
                    value={formData.contentType} 
                    onValueChange={(value) => handleInputChange('contentType', value)}
                    items={[
                      { value: 'MOVIE', label: 'Movie' },
                      { value: 'WEB_SERIES', label: 'Web Series' }
                    ]}
                    placeholder="Select content type"
                    className="bg-white border-gray-300 text-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="text-gray-700">Release Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                    placeholder="2024"
                    min="1900"
                    max="2030"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-gray-700">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                    placeholder="2h 30m or 3 Seasons"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating" className="text-gray-700">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', e.target.value)}
                    className="bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                    placeholder="8.5"
                    min="0"
                    max="10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality" className="text-gray-700">Quality</Label>
                  <Select 
                    value={formData.quality} 
                    onValueChange={(value) => handleInputChange('quality', value)}
                    items={[
                      { value: '', label: 'None' },
                      { value: 'HD', label: 'HD' },
                      { value: 'FULL_HD', label: 'Full HD' },
                      { value: 'FOUR_K', label: '4K' },
                      { value: 'EIGHT_K', label: '8K' }
                    ]}
                    placeholder="Select quality"
                    className="bg-white border-gray-300 text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                  placeholder="Enter content description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-800">Category</CardTitle>
              <CardDescription className="text-gray-600">
                Select a category for this content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-700">Category</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(value) => handleInputChange('categoryId', value)}
                  items={[
                    { value: '', label: 'None' },
                    ...filteredCategories.map(category => ({
                      value: category.id,
                      label: category.name
                    }))
                  ]}
                  placeholder="Select category"
                  className="bg-white border-gray-300 text-gray-800"
                />
              </div>
            </CardContent>
          </Card>

          {/* URLs */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-800">Media & URLs</CardTitle>
              <CardDescription className="text-gray-600">
                Upload poster image and add Telegram channel URL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="posterUrl" className="text-gray-700">Poster Image</Label>
                <ImageUpload
                  value={formData.posterUrl}
                  onChange={(url) => handleInputChange('posterUrl', url)}
                />
                <p className="text-sm text-gray-500">
                  Upload a poster image for your content. Recommended size: 300x450px
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegramUrl" className="text-gray-700">Telegram URL *</Label>
                <Input
                  id="telegramUrl"
                  value={formData.telegramUrl}
                  onChange={(e) => handleInputChange('telegramUrl', e.target.value)}
                  className="bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                  placeholder="https://t.me/yourchannel"
                  required
                />
                <p className="text-sm text-gray-500">
                  Users will be redirected to this Telegram channel when they click on the content
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating...' : 'Create Content'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}