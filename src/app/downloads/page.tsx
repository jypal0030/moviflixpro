'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileArchive, Globe } from 'lucide-react';

export default function DownloadsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const files = [
    {
      id: 'nextjs-backup',
      name: 'MoviFlixPro Next.js Backup',
      description: 'Complete Next.js project backup with all source files, database, and assets',
      size: '347 MB',
      icon: FileArchive,
      color: 'bg-blue-500',
      features: ['Complete source code', 'Database included', 'All assets', 'Ready to deploy']
    },
    {
      id: 'wordpress-theme',
      name: 'MoviFlixPro WordPress Theme',
      description: 'WordPress theme version with all functionality converted from Next.js',
      size: '26 KB',
      icon: Globe,
      color: 'bg-green-500',
      features: ['WordPress theme files', 'Custom post types', 'Admin panel', 'Ready to install']
    },
    {
      id: 'html-version',
      name: 'MoviFlixPro HTML Version',
      description: 'Complete HTML, CSS, Bootstrap & jQuery version - no server required',
      size: '26 KB',
      icon: Download,
      color: 'bg-purple-500',
      features: ['Complete HTML files', 'CSS & JavaScript', 'No server required', 'Ready to use']
    }
  ];

  const handleDownload = async (fileId: string) => {
    setDownloading(fileId);
    try {
      const response = await fetch(`/api/download?file=${fileId}`);
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || `${fileId}.tar.gz`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MoviFlixPro Downloads</h1>
          <p className="text-lg text-gray-600">
            Download the complete MoviFlixPro website files in your preferred format
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {files.map((file) => {
            const IconComponent = file.icon;
            return (
              <Card key={file.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${file.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{file.name}</CardTitle>
                      <CardDescription>{file.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">File Size:</span>
                      <Badge variant="secondary">{file.size}</Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Includes:</h4>
                      <div className="space-y-1">
                        {file.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleDownload(file.id)}
                      disabled={downloading === file.id}
                      className="w-full"
                      size="lg"
                    >
                      {downloading === file.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download {file.name}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Choose the format that best suits your needs:
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-left">
                  <h4 className="font-medium text-gray-900 mb-2">Next.js Backup:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Complete source code</li>
                    <li>• Database files</li>
                    <li>• All assets and media</li>
                    <li>• Development environment ready</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900 mb-2">WordPress Theme:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Easy WordPress installation</li>
                    <li>• Admin panel included</li>
                    <li>• Custom post types</li>
                    <li>• Ready for production</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900 mb-2">HTML Version:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• No server required</li>
                    <li>• Works directly in browser</li>
                    <li>• Complete functionality</li>
                    <li>• Mobile responsive</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}