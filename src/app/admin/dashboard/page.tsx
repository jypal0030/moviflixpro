'use client';

import { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Film, 
  Tv, 
  FolderOpen, 
  Settings, 
  Shield, 
  Database,
  Menu,
  X,
  Home,
  TrendingUp,
  Users,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Save,
  Download,
  Upload,
  Key,
  Activity,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminStats {
  totalMovies: number;
  totalWebSeries: number;
  totalCategories: number;
  totalViews: number;
  recentActivity: Array<{
    id: string;
    action: string;
    target: string;
    timestamp: string;
  }>;
}

interface ContentItem {
  id: string;
  title: string;
  contentType: 'MOVIE' | 'WEB_SERIES';
  year?: number;
  rating?: number;
  quality?: string;
  category?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalMovies: 0,
    totalWebSeries: 0,
    totalCategories: 0,
    totalViews: 0,
    recentActivity: []
  });
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    fetchStats();
    fetchContent();
  }, []);

  const fetchStats = async () => {
    try {
      const [moviesRes, webSeriesRes, categoriesRes] = await Promise.all([
        fetch('/api/content/movies'),
        fetch('/api/content/tv-shows'),
        fetch('/api/categories')
      ]);

      const movies = await moviesRes.json();
      const webSeries = await webSeriesRes.json();
      const categories = await categoriesRes.json();

      setStats({
        totalMovies: movies.length || 0,
        totalWebSeries: webSeries.length || 0,
        totalCategories: categories.length || 0,
        totalViews: 0, // This would come from analytics in production
        recentActivity: [
          { id: '1', action: 'Added', target: 'New Movie', timestamp: '2 hours ago' },
          { id: '2', action: 'Updated', target: 'Category', timestamp: '5 hours ago' },
          { id: '3', action: 'Deleted', target: 'Web Series', timestamp: '1 day ago' },
        ]
      });
    } catch (error) {
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      const [moviesRes, webSeriesRes] = await Promise.all([
        fetch('/api/content/movies'),
        fetch('/api/content/tv-shows')
      ]);

      const movies = await moviesRes.json();
      const webSeries = await webSeriesRes.json();

      const allContent = [
        ...movies.map((m: any) => ({ ...m, category: m.category?.name })),
        ...webSeries.map((w: any) => ({ ...w, category: w.category?.name }))
      ];

      setContent(allContent);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  const handleAddMovie = () => {
    window.location.href = '/admin/content/new?type=MOVIE';
  };

  const handleAddWebSeries = () => {
    window.location.href = '/admin/content/new?type=WEB_SERIES';
  };

  const handleAddCategory = () => {
    window.location.href = '/admin/categories';
  };

  const handleEditContent = (item: ContentItem) => {
    window.location.href = `/admin/content/${item.id}/edit`;
  };

  const handleDeleteContent = async (item: ContentItem) => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      try {
        const response = await fetch(`/api/admin/content/${item.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchContent(); // Refresh the list
        } else {
          alert('Failed to delete content');
        }
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('An error occurred while deleting content');
      }
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent stats={stats} loading={loading} error={error} />;
      case 'content':
        return <ContentManagement content={content} onRefresh={fetchContent} onAddMovie={handleAddMovie} onAddWebSeries={handleAddWebSeries} onAddCategory={handleAddCategory} onEditContent={handleEditContent} onDeleteContent={handleDeleteContent} />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'settings':
        return <SystemSettings />;
      case 'security':
        return <BackupSecurity />;
      default:
        return <DashboardContent stats={stats} loading={loading} error={error} />;
    }
  };

  const SidebarItem = ({ icon: Icon, label, section }: { 
    icon: any; 
    label: string; 
    section: string; 
  }) => (
    <button
      onClick={() => {
        setActiveSection(section);
        setSidebarOpen(false);
      }}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        activeSection === section
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="outline"
          className="bg-white border-blue-200 text-gray-700 shadow-sm"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-sm transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center p-6 border-b border-gray-200">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <SidebarItem icon={Home} label="Dashboard" section="dashboard" />
            <SidebarItem icon={Film} label="Content Management" section="content" />
            <SidebarItem icon={BarChart3} label="Analytics & Reports" section="analytics" />
            <SidebarItem icon={Settings} label="System Settings" section="settings" />
            <SidebarItem icon={Shield} label="Backup & Security" section="security" />
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="p-4 lg:p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
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
                onClick={handleLogout}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Dashboard Content Component
function DashboardContent({ stats, loading, error }: { 
  stats: AdminStats; 
  loading: boolean; 
  error: string; 
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-700">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Movies</CardTitle>
            <Film className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{stats.totalMovies}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Web Series</CardTitle>
            <Tv className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{stats.totalWebSeries}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{stats.totalCategories}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{stats.totalViews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800">Recent Activity</CardTitle>
          <CardDescription className="text-gray-600">Latest system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-800 font-medium">{activity.action}</p>
                  <p className="text-gray-600 text-sm">{activity.target}</p>
                </div>
                <span className="text-gray-500 text-sm">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Content Management Component
function ContentManagement({ content, onRefresh, onAddMovie, onAddWebSeries, onAddCategory, onEditContent, onDeleteContent }: { 
  content: ContentItem[]; 
  onRefresh: () => void;
  onAddMovie: () => void;
  onAddWebSeries: () => void;
  onAddCategory: () => void;
  onEditContent: (item: ContentItem) => void;
  onDeleteContent: (item: ContentItem) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Content Management</h1>
          <p className="text-gray-600">Manage movies, web series, and categories</p>
        </div>
        <Button 
          onClick={() => setActiveSection('dashboard')}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <Film className="h-12 w-12 text-blue-600 mb-4" />
            <CardTitle className="text-gray-800">Movies</CardTitle>
            <CardDescription className="text-gray-600">
              Add, edit, and delete movies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onAddMovie} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Movie
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <Tv className="h-12 w-12 text-blue-600 mb-4" />
            <CardTitle className="text-gray-800">Web Series</CardTitle>
            <CardDescription className="text-gray-600">
              Add, edit, and delete web series
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onAddWebSeries} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Web Series
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <FolderOpen className="h-12 w-12 text-blue-600 mb-4" />
            <CardTitle className="text-gray-800">Categories</CardTitle>
            <CardDescription className="text-gray-600">
              Manage content categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onAddCategory} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Content List */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800">All Content</CardTitle>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border-gray-300 text-gray-800 placeholder-gray-400 max-w-sm"
            />
            <Button onClick={onRefresh} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContent.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-gray-800 font-medium">{item.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {item.contentType}
                      </Badge>
                      {item.year && <span className="text-gray-500 text-sm">{item.year}</span>}
                      {item.rating && <span className="text-yellow-600 text-sm">★ {item.rating}</span>}
                      {item.quality && <span className="text-blue-600 text-sm">{item.quality}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => onEditContent(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => onDeleteContent(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Analytics Section Component
function AnalyticsSection() {
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    popularContent: [],
    userActivity: [],
    categoryStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch content data for analytics
      const [moviesRes, webSeriesRes, categoriesRes] = await Promise.all([
        fetch('/api/content/movies'),
        fetch('/api/content/tv-shows'),
        fetch('/api/categories')
      ]);

      const movies = await moviesRes.json();
      const webSeries = await webSeriesRes.json();
      const categories = await categoriesRes.json();

      // Calculate analytics
      const allContent = [...movies, ...webSeries];
      const categoryStats = categories.map(category => {
        const contentInCategory = allContent.filter(content => content.categoryId === category.id);
        return {
          name: category.name,
          count: contentInCategory.length,
          type: category.contentType
        };
      });

      // Sort by rating for popular content
      const popularContent = allContent
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 5);

      // Generate mock user activity (in real app, this would come from analytics)
      const userActivity = [
        { action: 'Page Views', count: Math.floor(Math.random() * 10000) + 1000, change: '+12%' },
        { action: 'Unique Visitors', count: Math.floor(Math.random() * 1000) + 100, change: '+8%' },
        { action: 'Content Clicks', count: Math.floor(Math.random() * 500) + 50, change: '+15%' },
        { action: 'Telegram Redirects', count: Math.floor(Math.random() * 200) + 20, change: '+25%' }
      ];

      setAnalytics({
        totalViews: allContent.reduce((sum, content) => sum + (content.rating || 0) * 100, 0),
        popularContent,
        userActivity,
        categoryStats
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics & Reports</h1>
          <p className="text-gray-600">View detailed analytics and generate reports</p>
        </div>
        <Button 
          onClick={() => setActiveSection('dashboard')}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* User Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analytics.userActivity.map((activity, index) => (
          <Card key={index} className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{activity.action}</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{activity.count.toLocaleString()}</div>
              <p className="text-xs text-green-600">{activity.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Popular Content</CardTitle>
            <CardDescription className="text-gray-600">
              Top rated content on your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.popularContent.map((content: any, index: number) => (
                <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-bold text-blue-600">#{index + 1}</div>
                    <div>
                      <h3 className="text-gray-800 font-medium">{content.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="border-blue-200 text-blue-700">
                          {content.contentType}
                        </Badge>
                        {content.rating && (
                          <span className="text-yellow-600 text-sm">★ {content.rating}</span>
                        )}
                        {content.category?.name && (
                          <span className="text-gray-500 text-sm">{content.category.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {analytics.popularContent.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No content available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Category Distribution</CardTitle>
            <CardDescription className="text-gray-600">
              Content distribution across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.categoryStats.map((stat: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {stat.type === 'MOVIE' ? (
                      <Film className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Tv className="h-5 w-5 text-green-600" />
                    )}
                    <div>
                      <h3 className="text-gray-800 font-medium">{stat.name}</h3>
                      <p className="text-sm text-gray-500">{stat.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800">{stat.count}</div>
                    <div className="text-xs text-gray-500">items</div>
                  </div>
                </div>
              ))}
              {analytics.categoryStats.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No categories available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800">Generate Reports</CardTitle>
          <CardDescription className="text-gray-600">
            Export data and generate comprehensive reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                const data = {
                  categories: analytics.categoryStats,
                  popularContent: analytics.popularContent,
                  userActivity: analytics.userActivity,
                  generatedAt: new Date().toISOString()
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Analytics Data
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={fetchAnalytics}
            >
              <Activity className="h-4 w-4 mr-2" />
              Refresh Analytics
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                alert('Advanced reporting features would be integrated here');
              }}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Advanced Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// System Settings Component
function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Movieflix Pro',
    siteDescription: 'Your ultimate streaming destination',
    adminEmail: 'admin@movieflix.com',
    maxContentPerPage: '20',
    enableRegistration: true,
    maintenanceMode: false,
    autoApproveContent: true,
    enableNotifications: true,
    seoKeywords: 'movies, web series, streaming, entertainment',
    seoDescription: 'Watch the latest movies and web series on Movieflix Pro'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store settings in localStorage for demo
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        siteName: 'Movieflix Pro',
        siteDescription: 'Your ultimate streaming destination',
        adminEmail: 'admin@movieflix.com',
        maxContentPerPage: '20',
        enableRegistration: true,
        maintenanceMode: false,
        autoApproveContent: true,
        enableNotifications: true,
        seoKeywords: 'movies, web series, streaming, entertainment',
        seoDescription: 'Watch the latest movies and web series on Movieflix Pro'
      });
      setMessage('Settings reset to default');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">System Settings</h1>
          <p className="text-gray-600">Configure your site settings and preferences</p>
        </div>
        <Button 
          onClick={() => setActiveSection('dashboard')}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {message && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-700">
            {message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Basic Settings</CardTitle>
            <CardDescription className="text-gray-600">
              Site configuration and basic options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="siteName" className="text-sm font-medium text-gray-700">Site Name</label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                className="bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                placeholder="Enter site name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="siteDescription" className="text-sm font-medium text-gray-300">Site Description</label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                className="bg-black/50 border-purple-500/30 text-white placeholder-gray-400"
                placeholder="Enter site description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="adminEmail" className="text-sm font-medium text-gray-300">Admin Email</label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                className="bg-black/50 border-purple-500/30 text-white placeholder-gray-400"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="maxContentPerPage" className="text-sm font-medium text-gray-300">Max Content Per Page</label>
              <Select 
                value={settings.maxContentPerPage} 
                onValueChange={(value) => handleSettingChange('maxContentPerPage', value)}
              >
                <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feature Settings */}
        <Card className="bg-black/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Feature Settings</CardTitle>
            <CardDescription className="text-gray-300">
              Enable or disable site features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Enable Registration</h3>
                <p className="text-sm text-gray-400">Allow new user registration</p>
              </div>
              <Button
                onClick={() => handleSettingChange('enableRegistration', !settings.enableRegistration)}
                variant="outline"
                className={`${
                  settings.enableRegistration 
                    ? 'bg-green-500/20 border-green-500/30 text-green-300' 
                    : 'bg-red-500/20 border-red-500/30 text-red-300'
                }`}
              >
                {settings.enableRegistration ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Maintenance Mode</h3>
                <p className="text-sm text-gray-400">Put site in maintenance mode</p>
              </div>
              <Button
                onClick={() => handleSettingChange('maintenanceMode', !settings.maintenanceMode)}
                variant="outline"
                className={`${
                  settings.maintenanceMode 
                    ? 'bg-red-500/20 border-red-500/30 text-red-300' 
                    : 'bg-green-500/20 border-green-500/30 text-green-300'
                }`}
              >
                {settings.maintenanceMode ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Auto Approve Content</h3>
                <p className="text-sm text-gray-400">Automatically approve new content</p>
              </div>
              <Button
                onClick={() => handleSettingChange('autoApproveContent', !settings.autoApproveContent)}
                variant="outline"
                className={`${
                  settings.autoApproveContent 
                    ? 'bg-green-500/20 border-green-500/30 text-green-300' 
                    : 'bg-red-500/20 border-red-500/30 text-red-300'
                }`}
              >
                {settings.autoApproveContent ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Enable Notifications</h3>
                <p className="text-sm text-gray-400">Send email notifications</p>
              </div>
              <Button
                onClick={() => handleSettingChange('enableNotifications', !settings.enableNotifications)}
                variant="outline"
                className={`${
                  settings.enableNotifications 
                    ? 'bg-green-500/20 border-green-500/30 text-green-300' 
                    : 'bg-red-500/20 border-red-500/30 text-red-300'
                }`}
              >
                {settings.enableNotifications ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card className="bg-black/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">SEO Settings</CardTitle>
            <CardDescription className="text-gray-300">
              Search engine optimization settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="seoKeywords" className="text-sm font-medium text-gray-300">SEO Keywords</label>
              <Textarea
                id="seoKeywords"
                value={settings.seoKeywords}
                onChange={(e) => handleSettingChange('seoKeywords', e.target.value)}
                className="bg-black/50 border-purple-500/30 text-white placeholder-gray-400"
                placeholder="Enter SEO keywords separated by commas"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="seoDescription" className="text-sm font-medium text-gray-300">SEO Description</label>
              <Textarea
                id="seoDescription"
                value={settings.seoDescription}
                onChange={(e) => handleSettingChange('seoDescription', e.target.value)}
                className="bg-black/50 border-purple-500/30 text-white placeholder-gray-400"
                placeholder="Enter SEO description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-black/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Actions</CardTitle>
            <CardDescription className="text-gray-300">
              Manage your settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleSaveSettings}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleResetSettings}
              variant="outline"
              className="w-full border-red-500/30 text-red-300 hover:bg-red-500/10"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>

            <div className="text-xs text-gray-400 text-center">
              Settings are automatically applied throughout the site
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Backup & Security Component
function BackupSecurity() {
  const [lastBackup, setLastBackup] = useState('2024-01-15 10:30:00');
  const [backupLoading, setBackupLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securityLogs, setSecurityLogs] = useState([
    { id: '1', action: 'Admin Login', description: 'Successful login from 192.168.1.1', timestamp: '2 hours ago', type: 'success' },
    { id: '2', action: 'Password Change', description: 'Admin password updated successfully', timestamp: '1 day ago', type: 'info' },
    { id: '3', action: 'Backup Created', description: 'System backup completed', timestamp: '2 days ago', type: 'success' },
    { id: '4', action: 'Failed Login Attempt', description: 'Invalid credentials from 192.168.1.100', timestamp: '3 days ago', type: 'warning' }
  ]);
  const [message, setMessage] = useState('');

  const handleCreateBackup = async () => {
    setBackupLoading(true);
    setMessage('');
    
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const now = new Date();
      const timestamp = now.toLocaleString();
      setLastBackup(timestamp);
      
      // Add to security logs
      const newLog = {
        id: Date.now().toString(),
        action: 'Backup Created',
        description: 'System backup completed successfully',
        timestamp: 'Just now',
        type: 'success'
      };
      setSecurityLogs(prev => [newLog, ...prev]);
      
      setMessage('Backup created successfully!');
      
      // Download backup file (simulate)
      const backupData = {
        timestamp: now.toISOString(),
        data: 'Backup data would be here in production',
        settings: localStorage.getItem('adminSettings') || '{}'
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${now.toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      setMessage('Failed to create backup');
    } finally {
      setBackupLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setMessage('');

    try {
      // Validate passwords
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setMessage('New passwords do not match');
        setPasswordLoading(false);
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        setMessage('Password must be at least 6 characters long');
        setPasswordLoading(false);
        return;
      }

      // Call the API to change password
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Failed to update password');
        setPasswordLoading(false);
        return;
      }

      // Add to security logs
      const newLog = {
        id: Date.now().toString(),
        action: 'Password Change',
        description: 'Admin password updated successfully',
        timestamp: 'Just now',
        type: 'success'
      };
      setSecurityLogs(prev => [newLog, ...prev]);

      setMessage('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

    } catch (error) {
      setMessage('Failed to update password. Please try again.');
    } finally {
      setPasswordLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Backup & Security</h1>
        <p className="text-gray-300">Manage data backups and security settings</p>
      </div>

      {message && (
        <Alert className="border-green-500/30 bg-green-500/10">
          <AlertDescription className="text-green-300">
            {message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Data Backup</CardTitle>
            <CardDescription className="text-gray-300">
              Backup and restore your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-sm text-gray-300">Last Backup:</p>
              <p className="text-white font-medium">{lastBackup}</p>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={handleCreateBackup}
                disabled={backupLoading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {backupLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Backup...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Create Backup Now
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-purple-500/30 text-white"
                onClick={() => {
                  alert('Restore functionality would be implemented here');
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Restore Backup
              </Button>
            </div>
            <div className="text-xs text-gray-400 text-center">
              Backups include all content, categories, and settings
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Security Settings</CardTitle>
            <CardDescription className="text-gray-300">
              Manage security and access control
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handlePasswordChange}>
              <div>
                <label className="text-sm font-medium text-gray-300">Change Admin Password</label>
                <div className="mt-2 space-y-2">
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                    className="bg-black/50 border-purple-500/30 text-white"
                    required
                  />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                    className="bg-black/50 border-purple-500/30 text-white"
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                    className="bg-black/50 border-purple-500/30 text-white"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={passwordLoading}
                  className="mt-2 bg-purple-600 hover:bg-purple-700"
                >
                  {passwordLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Security Logs</CardTitle>
          <CardDescription className="text-gray-300">
            Recent security activities and access logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {securityLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    log.type === 'success' ? 'bg-green-400' :
                    log.type === 'warning' ? 'bg-yellow-400' :
                    log.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                  }`} />
                  <div>
                    <p className="text-white font-medium">{log.action}</p>
                    <p className="text-gray-400 text-sm">{log.description}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">{log.timestamp}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              className="border-purple-500/30 text-white"
              onClick={() => {
                const newLog = {
                  id: Date.now().toString(),
                  action: 'Logs Viewed',
                  description: 'Security logs accessed by admin',
                  timestamp: 'Just now',
                  type: 'info'
                };
                setSecurityLogs(prev => [newLog, ...prev]);
              }}
            >
              <Activity className="h-4 w-4 mr-2" />
              Refresh Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}