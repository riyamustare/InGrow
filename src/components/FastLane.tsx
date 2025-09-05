import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { CommentDrafts } from './CommentDrafts';
import { Zap, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { apiClient } from '../utils/api';

export function FastLane() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedPost, setExtractedPost] = useState<any>(null);

  const handleUrlSubmit = async () => {
    if (!url.trim()) {
      toast.error('Please enter a LinkedIn post URL');
      return;
    }

    if (!url.includes('linkedin.com')) {
      toast.error('Please enter a valid LinkedIn URL');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiClient.analyzePost(url);
      setExtractedPost(response.post);
      toast.success('Post analyzed successfully!');
    } catch (error) {
      console.error('Error analyzing post:', error);
      
      // Fall back to mock data
      const mockPost = {
        id: 'fastlane-1',
        author: {
          name: 'Jennifer Martinez',
          title: 'Senior Product Designer at UXCorp',
          avatar: '',
          initials: 'JM'
        },
        content: 'Design systems aren\'t just about components and tokens. They\'re about creating a shared language between design and engineering. The real magic happens when your system becomes invisible - when teams stop thinking about the system and start thinking about the user.',
        timestamp: '30 minutes ago',
        engagement: { likes: 127, comments: 34, shares: 8 },
        priority: 'high' as const,
        url: url
      };
      
      setExtractedPost(mockPost);
      toast.success('Post analyzed (demo mode)');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setExtractedPost(null);
  };

  if (extractedPost) {
    return (
      <CommentDrafts 
        post={extractedPost} 
        onBack={handleReset}
        onComplete={handleReset}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Fast Lane</h2>
          <p className="text-muted-foreground">
            Paste any LinkedIn post URL for instant comment generation
          </p>
        </div>
      </div>

      {/* Fast Lane Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Comment Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              LinkedIn Post URL
            </label>
            <Input
              placeholder="https://www.linkedin.com/posts/username_..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <Button 
            onClick={handleUrlSubmit}
            disabled={!url.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Post...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Comments
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Fast Lane Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Paste URL</h4>
                <p className="text-sm text-muted-foreground">
                  Copy any LinkedIn post URL and paste it above
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes the post content and engagement patterns
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Get Drafts</h4>
                <p className="text-sm text-muted-foreground">
                  Receive 3 tailored comment variants ready to approve and copy
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Pro Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Fast Lane bypasses the usual 60+ minute delay</li>
                <li>• Works with any public LinkedIn post</li>
                <li>• Perfect for time-sensitive commenting opportunities</li>
                <li>• Comments are generated based on real-time engagement data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Fast Lane Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Fast Lane Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div>
                <p className="text-sm font-medium">Comment on Sarah Chen's post</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="outline">Completed</Badge>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div>
                <p className="text-sm font-medium">Comment on Michael Rodriguez's post</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
              <Badge variant="outline">Completed</Badge>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Comment on Emma Thompson's post</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <Badge variant="outline">Completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}