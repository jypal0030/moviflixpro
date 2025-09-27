"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Film, 
  Tv, 
  FolderOpen, 
  Users, 
  Settings, 
  BarChart3, 
  Database,
  Upload,
  Download,
  Bell,
  Search,
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Eye,
  Filter,
  Calendar,
  TrendingUp,
  UserCheck,
  Shield,
  LogOut,
  Activity,
  FileText,
  Image as ImageIcon,
  Globe,
  Zap
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

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
  createdAt: string;
  views: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  contentType: 'MOVIE' | 'WEB_SERIES';
  contentCount: number;
}

interface UserActivity {
  id: string;
  userId: string;
  action: string;
  contentId?: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

interface SystemStats {
  totalContent: number;
  totalUsers: number;
  totalViews: number;
  todayViews: number;
  popularContent: Content[];
  recentActivity: UserActivity[];
}

export default function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [movies, setMovies] = useState<Content[]>([]);
  const [webSeries, setWebSeries] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<Content | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  // Settings state
  const [settings, setSettings] = useState({
    siteName: "MoviFlixPro",
    siteDescription: "Your ultimate entertainment destination",
    enableRegistration: false,
    enableComments: false,
    maxUploadSize: "10",
    seoKeywords: "movies, web series, streaming, entertainment",
    analyticsEnabled: true,
    maintenanceMode: false
  });

  useEffect(() => {
    checkAuth();
    fetchData();
    fetchSystemStats();
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

      // Fetch user activities (mock data for now)
      const mockActivities: UserActivity[] = [
        {
          id: "1",
          userId: "user1",
          action: "viewed",
          contentId: "movie1",
          timestamp: new Date().toISOString(),
          ipAddress: "192.168.1.1",
          userAgent: "Mozilla/5.0..."
        }
      ];
      setUserActivities(mockActivities);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemStats = async () => {
    try {
      // Mock stats for now
      const stats: SystemStats = {
        totalContent: movies.length + webSeries.length,
        totalUsers: 1250,
        totalViews: 45670,
        todayViews: 1234,
        popularContent: movies.slice(0, 5),
        recentActivity: userActivities.slice(0, 10)
      };
      setSystemStats(stats);
    } catch (error) {
      console.error('Error fetching system stats:', error);
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
        await fetchSystemStats();
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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/content/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchData();
          await fetchSystemStats();
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

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Save settings to localStorage or API
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      setIsSettingsOpen(false);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
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
        <div className="flex gap-2">
          <Button onClick={() => handleAddNew(type)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Add {type === 'MOVIE' ? 'Movie' : 'Web Series'}
          </Button>
          <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">Poster</TableHead>
              <TableHead className="text-gray-300">Title</TableHead>
              <TableHead className="text-gray-300">Year</TableHead>
              <TableHead className="text-gray-300">Duration</TableHead>
              <TableHead className="text-gray-300">Rating</TableHead>
              <TableHead className="text-gray-300">Quality</TableHead>
              <TableHead className="text-gray-300">Category</TableHead>
              <TableHead className="text-gray-300">Views</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="border-gray-700">
                <TableCell>
                  <img
                    src={item.posterUrl || "/api/placeholder/60/90"}
                    alt={item.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="text-white font-medium">{item.title}</TableCell>
                <TableCell className="text-gray-300">{item.year}</TableCell>
                <TableCell className="text-gray-300">{item.duration}</TableCell>
                <TableCell className="text-gray-300">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    {item.rating}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-purple-600">
                    {item.quality === 'FOUR_K' ? '4K' : item.quality === 'FULL_HD' ? 'HD' : item.quality}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">{item.category?.name}</TableCell>
                <TableCell className="text-gray-300">{item.views || 0}</TableCell>
                <TableCell>
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Admin Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-500" />
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              </div>
              <Badge className="bg-green-600">Online</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsSettingsOpen(true)} className="border-gray-600 text-white hover:bg-gray-800">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" onClick={() => window.open('/', '_blank')} className="border-gray-600 text-white hover:bg-gray-800">
                View Site
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
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-gray-800">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="movies" className="data-[state=active]:bg-purple-600">
              <Film className="w-4 h-4 mr-2" />
              Movies
            </TabsTrigger>
            <TabsTrigger value="web-series" className="data-[state=active]:bg-purple-600">
              <Tv className="w-4 h-4 mr-2" />
              Web Series
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-purple-600">
              <FolderOpen className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    Total Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{systemStats?.totalContent || 0}</div>
                  <p className="text-xs text-gray-400">Movies + Series</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{systemStats?.totalUsers || 0}</div>
                  <p className="text-xs text-gray-400">Registered users</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Total Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{systemStats?.totalViews || 0}</div>
                  <p className="text-xs text-gray-400">All time views</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Today's Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{systemStats?.todayViews || 0}</div>
                  <p className="text-xs text-gray-400">Last 24 hours</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Popular Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemStats?.popularContent?.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.posterUrl || "/api/placeholder/40/60"}
                            alt={item.title}
                            className="w-8 h-12 object-cover rounded"
                          />
                          <span className="text-gray-300">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{item.views || 0} views</span>
                          <Badge className="bg-purple-600 text-xs">
                            {item.quality === 'FOUR_K' ? '4K' : item.quality}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">
                            User {activity.userId} {activity.action}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Movies Tab */}
          <TabsContent value="movies" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-white">Movies Management</h2>
                <Badge className="bg-blue-600">{filteredMovies.length} Movies</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search movies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white pl-10 w-64"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
                <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            <ContentTable items={filteredMovies} type="MOVIE" />
          </TabsContent>

          {/* Web Series Tab */}
          <TabsContent value="web-series" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-white">Web Series Management</h2>
                <Badge className="bg-green-600">{filteredWebSeries.length} Series</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search series..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white pl-10 w-64"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
                <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            <ContentTable items={filteredWebSeries} type="WEB_SERIES" />
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Categories Management</h2>
              <Button onClick={() => setIsCategoryDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      {category.name}
                      <Badge className="bg-purple-600">
                        {category.contentCount} items
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {category.contentType}
                      </Badge>
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Content Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Movie Views</span>
                        <span className="text-white">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Series Views</span>
                        <span className="text-white">25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quality Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">4K Content</span>
                        <span className="text-white">15%</span>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">HD Content</span>
                        <span className="text-white">60%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">SD Content</span>
                        <span className="text-white">25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">User Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg border border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">User ID</TableHead>
                        <TableHead className="text-gray-300">Action</TableHead>
                        <TableHead className="text-gray-300">Content</TableHead>
                        <TableHead className="text-gray-300">IP Address</TableHead>
                        <TableHead className="text-gray-300">Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userActivities.map((activity) => (
                        <TableRow key={activity.id} className="border-gray-700">
                          <TableCell className="text-gray-300">{activity.userId}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-600">
                              {activity.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">{activity.contentId || '-'}</TableCell>
                          <TableCell className="text-gray-300">{activity.ipAddress}</TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(activity.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Content Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingItem ? 'Edit Content' : 'Add New Content'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="contentType">Content Type *</Label>
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

            <div className="grid grid-cols-3 gap-4">
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
                  placeholder="2h 30m"
                />
              </div>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quality">Quality</Label>
                <Select value={formData.quality} onValueChange={(value) => setFormData({...formData, quality: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HD">HD</SelectItem>
                    <SelectItem value="FULL_HD">Full HD</SelectItem>
                    <SelectItem value="FOUR_K">4K</SelectItem>
                    <SelectItem value="EIGHT_K">8K</SelectItem>
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
                    {categories.map((category) => (
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

            <div>
              <Label htmlFor="posterUrl">Poster URL</Label>
              <Input
                id="posterUrl"
                value={formData.posterUrl}
                onChange={(e) => setFormData({...formData, posterUrl: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700 flex-1"
              >
                {saving ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">System Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable User Registration</Label>
                    <p className="text-sm text-gray-400">Allow users to register accounts</p>
                  </div>
                  <Switch
                    checked={settings.enableRegistration}
                    onCheckedChange={(checked) => setSettings({...settings, enableRegistration: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Comments</Label>
                    <p className="text-sm text-gray-400">Allow users to comment on content</p>
                  </div>
                  <Switch
                    checked={settings.enableComments}
                    onCheckedChange={(checked) => setSettings({...settings, enableComments: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Analytics</Label>
                    <p className="text-sm text-gray-400">Track user behavior and statistics</p>
                  </div>
                  <Switch
                    checked={settings.analyticsEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, analyticsEnabled: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-gray-400">Put site in maintenance mode</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Upload Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                  <Input
                    id="maxUploadSize"
                    value={settings.maxUploadSize}
                    onChange={(e) => setSettings({...settings, maxUploadSize: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="seoKeywords">SEO Keywords</Label>
                  <Textarea
                    id="seoKeywords"
                    value={settings.seoKeywords}
                    onChange={(e) => setSettings({...settings, seoKeywords: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="movies, web series, streaming, entertainment"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSaveSettings}
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700 flex-1"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsSettingsOpen(false)}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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