\"use client";

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
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
      try {
        const categoriesRes = await fetch('/api/categories');
        if (categoriesRes.ok) {
          const allCategories = await categoriesRes.json();
          setCategories(allCategories);
        }
      } catch (error) {
        console.log('Categories fetch failed, using mock data');
        // Mock categories if API fails
        setCategories([
          { id: "1", name: "Action", slug: "action", contentType: "MOVIE", contentCount: 0 },
          { id: "2", name: "Comedy", slug: "comedy", contentType: "MOVIE", contentCount: 0 },
          { id: "3", name: "Drama", slug: "drama", contentType: "MOVIE", contentCount: 0 },
        ]);
      }

      // Fetch movies
      try {
        const moviesRes = await fetch('/api/content?type=MOVIE');
        if (moviesRes.ok) {
          const moviesData = await moviesRes.json();
          setMovies(moviesData);
        }
      } catch (error) {
        console.log('Movies fetch failed');
        setMovies([]);
      }

      // Fetch web series
      try {
        const webSeriesRes = await fetch('/api/content?type=WEB_SERIES');
        if (webSeriesRes.ok) {
          const webSeriesData = await webSeriesRes.json();
          setWebSeries(webSeriesData);
        }
      } catch (error) {
        console.log('Web series fetch failed');
        setWebSeries([]);
      }
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
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    
    if (!formData.contentType) {
      alert('Content type is required');
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

      console.log('Saving content:', { url, method, payload });

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
        alert('Content saved successfully!');
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
        alert('Image uploaded successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
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

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      });
      window.location.href = '/admin-login';
    } catch (error) {
      console.error('Error logging out:', error);
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
                  src={item.posterUrl || "https://via.placeholder.com/100x150"}
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
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="movies" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Film className="w-4 h-4 mr-2" />
              Movies
            </TabsTrigger>
            <TabsTrigger value="web-series" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Tv className="w-4 h-4 mr-2" />
              Web Series
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <FolderOpen className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Movies</CardTitle>
                  <Film className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{movies.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Web Series</CardTitle>
                  <Tv className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{webSeries.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Categories</CardTitle>
                  <FolderOpen className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{categories.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="movies">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search movies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              <ContentTable items={filteredMovies} type="MOVIE" />
            </div>
          </TabsContent>

          <TabsContent value="web-series">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search web series..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              <ContentTable items={filteredWebSeries} type="WEB_SERIES" />
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Categories</h2>
                <Button onClick={() => setIsCategoryDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
              
              <div className="grid gap-4">
                {categories.map((category) => (
                  <Card key={category.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white">{category.name}</h3>
                          <p className="text-sm text-gray-300">{category.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-purple-600">
                              {category.contentType}
                            </Badge>
                            <Badge variant="outline" className="border-gray-600 text-gray-300">
                              {category.contentCount} items
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Content Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Content' : 'Add New Content'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="contentType">Content Type *</Label>
                <Select value={formData.contentType} onValueChange={(value: 'MOVIE' | 'WEB_SERIES') => setFormData(prev => ({ ...prev, contentType: value }))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="MOVIE">Movie</SelectItem>
                    <SelectItem value="WEB_SERIES">Web Series</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., 2h 30m"
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating (0-10)</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quality">Quality</Label>
                <Select value={formData.quality} onValueChange={(value) => setFormData(prev => ({ ...prev, quality: value }))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="HD">HD</SelectItem>
                    <SelectItem value="FULL_HD">Full HD</SelectItem>
                    <SelectItem value="FOUR_K">4K</SelectItem>
                    <SelectItem value="EIGHT_K">8K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {categories.filter(cat => cat.contentType === formData.contentType).map((category) => (
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
                onChange={(e) => setFormData(prev => ({ ...prev, telegramUrl: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="https://t.me/..."
              />
            </div>

            <div>
              <Label htmlFor="posterUrl">Poster URL</Label>
              <div className="flex gap-2">
                <Input
                  id="posterUrl"
                  value={formData.posterUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, posterUrl: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white flex-1"
                  placeholder="https://... or upload below"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={uploading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {uploading ? 'Uploading...' : <Upload className="w-4 h-4" />}
                </Button>
              </div>
              {formData.posterUrl && (
                <div className="mt-2">
                  <img
                    src={formData.posterUrl}
                    alt="Poster preview"
                    className="w-32 h-48 object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-600 text-white hover:bg-gray-700">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}