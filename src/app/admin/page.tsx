"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Film, 
  Tv, 
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Content {
  id: string;
  title: string;
  description?: string;
  posterUrl?: string;
  year?: number;
  duration?: string;
  rating?: number;
  quality?: 'HD' | 'FULL_HD' | 'FOUR_K' | 'EIGHT_K';
  telegramUrl?: string;
  contentType: 'MOVIE' | 'WEB_SERIES';
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  contentType: 'MOVIE' | 'WEB_SERIES';
  contentCount: number;
}

export default function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [movies, setMovies] = useState<Content[]>([]);
  const [webSeries, setWebSeries] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<Content | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    posterUrl: "",
    year: "",
    duration: "",
    rating: "",
    quality: "",
    telegramUrl: "",
    contentType: "MOVIE" as 'MOVIE' | 'WEB_SERIES',
    categoryId: ""
  });

  // Category form state
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    contentType: "MOVIE" as 'MOVIE' | 'WEB_SERIES'
  });

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/check-auth');
      if (!response.ok) {
        window.location.href = '/admin-login';
      }
    } catch (error) {
      window.location.href = '/admin-login';
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const categoriesRes = await fetch('/api/categories');
      const allCategories = await categoriesRes.json();
      setCategories(allCategories);

      // Fetch all content
      const moviesRes = await fetch('/api/content?type=MOVIE');
      const moviesData = await moviesRes.json();
      setMovies(moviesData);

      const webSeriesRes = await fetch('/api/content?type=WEB_SERIES');
      const webSeriesData = await webSeriesRes.json();
      setWebSeries(webSeriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Content) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      posterUrl: item.posterUrl || "",
      year: item.year?.toString() || "",
      duration: item.duration || "",
      rating: item.rating?.toString() || "",
      quality: item.quality || "",
      telegramUrl: item.telegramUrl || "",
      contentType: item.contentType,
      categoryId: item.category?.id || ""
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = (contentType: 'MOVIE' | 'WEB_SERIES') => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      posterUrl: "",
      year: "",
      duration: "",
      rating: "",
      quality: "",
      telegramUrl: "",
      contentType,
      categoryId: ""
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    
    if (!formData.contentType) {
      alert('Content type is required');
      return;
    }

    if (formData.year && (isNaN(parseInt(formData.year)) || parseInt(formData.year) < 1900 || parseInt(formData.year) > new Date().getFullYear() + 5)) {
      alert('Please enter a valid year');
      return;
    }

    if (formData.rating && (isNaN(parseFloat(formData.rating)) || parseFloat(formData.rating) < 0 || parseFloat(formData.rating) > 10)) {
      alert('Rating must be between 0 and 10');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        year: formData.year ? parseInt(formData.year) : undefined,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        categoryId: formData.categoryId || undefined
      };

      const url = editingItem 
        ? `/api/content/${editingItem.id}`
        : '/api/content';
      
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchData();
        setIsDialogOpen(false);
        setEditingItem(null);
        // Reset form
        setFormData({
          title: "",
          description: "",
          posterUrl: "",
          year: "",
          duration: "",
          rating: "",
          quality: "",
          telegramUrl: "",
          contentType: "MOVIE",
          categoryId: ""
        });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Image upload function
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(prev => ({
          ...prev,
          posterUrl: result.url
        }));
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/content/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchData();
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to delete content');
        }
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Failed to delete content. Please try again.');
      }
    }
  };

  // Category management functions
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || "",
      contentType: category.contentType
    });
    setIsCategoryDialogOpen(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: "",
      description: "",
      contentType: "MOVIE"
    });
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryFormData.name.trim()) {
      alert('Category name is required');
      return;
    }

    if (!categoryFormData.contentType) {
      alert('Content type is required');
      return;
    }

    setSaving(true);
    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryFormData),
      });

      if (response.ok) {
        await fetchData();
        setIsCategoryDialogOpen(false);
        setEditingCategory(null);
        // Reset form
        setCategoryFormData({
          name: "",
          description: "",
          contentType: "MOVIE"
        });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchData();
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      });
      window.location.href = '/admin-login';
    } catch (error) {
      console.error('Error logging out:', error);
      // Even if there's an error, redirect to login
      window.location.href = '/admin-login';
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWebSeries = webSeries.filter(series =>
    series.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ContentTable = ({ items, type }: { items: Content[]; type: 'MOVIE' | 'WEB_SERIES' }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">{type === 'MOVIE' ? 'Movies' : 'Web Series'}</h2>
        <Button onClick={() => handleAddNew(type)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add {type === 'MOVIE' ? 'Movie' : 'Web Series'}
        </Button>
      </div>
      
      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.posterUrl || "/api/placeholder/100/150"}
                  alt={item.title}
                  className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                    <span>{item.year}</span>
                    <span>{item.duration}</span>
                    <Badge className="bg-purple-600">
                      {item.quality === 'FOUR_K' ? '4K' : item.quality === 'FULL_HD' ? 'HD' : item.quality}
                    </Badge>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {item.category?.name}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-yellow-400">★ {item.rating}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item.id)}
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Admin Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.open('/', '_blank')} className="border-gray-600 text-white hover:bg-gray-800">
                Back to Site
              </Button>
              <Button variant="outline" onClick={handleLogout} className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-800">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="movies" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Film className="w-4 h-4 mr-2" />
              Movies
            </TabsTrigger>
            <TabsTrigger 
              value="web-series" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Tv className="w-4 h-4 mr-2" />
              Web Series
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Movies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{movies.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Web Series</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{webSeries.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{categories.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{movies.length + webSeries.length}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Movies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {movies.slice(0, 5).map((movie) => (
                      <div key={movie.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{movie.title}</span>
                        <span className="text-gray-500">{movie.year}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Web Series</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {webSeries.slice(0, 5).map((series) => (
                      <div key={series.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{series.title}</span>
                        <span className="text-gray-500">{series.year}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Movies Tab */}
          <TabsContent value="movies" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pl-10"
              />
            </div>
            <ContentTable items={filteredMovies} type="MOVIE" />
          </TabsContent>

          {/* Web Series Tab */}
          <TabsContent value="web-series" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search web series..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pl-10"
              />
            </div>
            <ContentTable items={filteredWebSeries} type="WEB_SERIES" />
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Categories</h2>
              <Button onClick={handleAddCategory} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{category.name}</h3>
                        <p className="text-sm text-gray-400">{category.contentType}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {category.contentCount} items
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditCategory(category)}
                          className="border-gray-600 text-white hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Content' : 'Add New Content'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="posterUrl">Poster URL</Label>
              <div className="space-y-2">
                <Input
                  id="posterUrl"
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({...formData, posterUrl: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="https://example.com/poster.jpg"
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={uploading}
                    className="border-gray-600 text-white hover:bg-gray-700 flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
                {formData.posterUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.posterUrl}
                      alt="Poster preview"
                      className="w-20 h-28 object-cover rounded border border-gray-600"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="2h 30m or 3 Seasons"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="quality">Quality</Label>
                <Select value={formData.quality} onValueChange={(value) => setFormData({...formData, quality: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HD">HD</SelectItem>
                    <SelectItem value="FULL_HD">Full HD</SelectItem>
                    <SelectItem value="FOUR_K">4K</SelectItem>
                    <SelectItem value="EIGHT_K">8K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select value={formData.contentType} onValueChange={(value) => setFormData({...formData, contentType: value as 'MOVIE' | 'WEB_SERIES'})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MOVIE">Movie</SelectItem>
                    <SelectItem value="WEB_SERIES">Web Series</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({...formData, categoryId: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter(cat => cat.contentType === formData.contentType)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="telegramUrl">Telegram URL</Label>
              <Input
                id="telegramUrl"
                value={formData.telegramUrl}
                onChange={(e) => setFormData({...formData, telegramUrl: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="https://t.me/yourchannel"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700 flex-1">
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={saving}
                className="border-gray-600 text-white hover:bg-gray-800 flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter category name"
              />
            </div>

            <div>
              <Label htmlFor="categoryDescription">Description</Label>
              <Textarea
                id="categoryDescription"
                value={categoryFormData.description}
                onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
                rows={2}
                placeholder="Enter category description (optional)"
              />
            </div>

            <div>
              <Label htmlFor="categoryContentType">Content Type</Label>
              <Select 
                value={categoryFormData.contentType} 
                onValueChange={(value) => setCategoryFormData({...categoryFormData, contentType: value as 'MOVIE' | 'WEB_SERIES'})}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MOVIE">Movie</SelectItem>
                  <SelectItem value="WEB_SERIES">Web Series</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSaveCategory} 
                disabled={saving} 
                className="bg-purple-600 hover:bg-purple-700 flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCategoryDialogOpen(false)}
                disabled={saving}
                className="border-gray-600 text-white hover:bg-gray-800 flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}