'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Film, 
  Tv,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  contentType: 'MOVIE' | 'WEB_SERIES';
  createdAt: string;
  updatedAt: string;
  _count?: {
    contents: number;
  };
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    contentType: 'MOVIE' as 'MOVIE' | 'WEB_SERIES'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        resetForm();
        fetchCategories();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('An error occurred while saving category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      contentType: category.contentType
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? This will affect all content in this category.')) {
      try {
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchCategories();
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('An error occurred while deleting category');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      contentType: 'MOVIE'
    });
    setEditingCategory(null);
    setShowAddForm(false);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              <h1 className="text-xl font-bold text-gray-800">Category Management</h1>
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
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add/Edit Category Form */}
        {showAddForm && (
          <Card className="bg-white border-gray-200 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="text-gray-800">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {editingCategory ? 'Update category information' : 'Create a new category for organizing content'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">Category Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800"
                      placeholder="Enter category name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-gray-700">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="bg-white border-gray-300 text-gray-800"
                      placeholder="category-url-slug"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contentType" className="text-gray-700">Content Type *</Label>
                    <Select 
                      value={formData.contentType} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value as 'MOVIE' | 'WEB_SERIES' }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MOVIE">
                          <div className="flex items-center">
                            <Film className="h-4 w-4 mr-2" />
                            Movies
                          </div>
                        </SelectItem>
                        <SelectItem value="WEB_SERIES">
                          <div className="flex items-center">
                            <Tv className="h-4 w-4 mr-2" />
                            Web Series
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-white border-gray-300 text-gray-800"
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Categories List */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">All Categories</CardTitle>
            <CardDescription className="text-gray-600">
              Manage your content categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {category.contentType === 'MOVIE' ? (
                        <Film className="h-8 w-8 text-blue-600" />
                      ) : (
                        <Tv className="h-8 w-8 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{category.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700">
                          {category.contentType}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                          {category._count?.contents || 0} content
                        </Badge>
                        <span className="text-sm text-gray-500">
                          /{category.slug}
                        </span>
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {categories.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No categories found. Create your first category to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}