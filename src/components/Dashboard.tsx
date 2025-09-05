import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CommentDrafts } from './CommentDrafts';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Clock, MessageSquare, TrendingUp, ExternalLink, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { apiClient } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface Post {
  id: string;
  author: {
    name: string;
    title: string;
    avatar: string;
    initials: string;
  };
  content: string;
  timestamp: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  priority: 'high' | 'medium' | 'low';
  url: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      title: 'VP of Marketing at TechCorp',
      avatar: 'https://images.unsplash.com/photo-1738750908048-14200459c3c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMGxpbmtlZGlufGVufDF8fHx8MTc1NzA0NzYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      initials: 'SC'
    },
    content: 'Just launched our new AI-powered customer service platform. The results after 30 days are incredible: 40% reduction in response time, 25% increase in customer satisfaction. The key was focusing on understanding customer intent rather than just keyword matching.',
    timestamp: '2 hours ago',
    engagement: { likes: 284, comments: 67, shares: 23 },
    priority: 'high',
    url: 'https://linkedin.com/posts/sarahchen/ai-customer-service'
  },
  {
    id: '2',
    author: {
      name: 'Michael Rodriguez',
      title: 'CEO at StartupX',
      avatar: '',
      initials: 'MR'
    },
    content: 'Unpopular opinion: The best product managers are not the ones with the most features shipped, but the ones who kill the most features before they get built. Less is more in product development.',
    timestamp: '4 hours ago',
    engagement: { likes: 156, comments: 89, shares: 12 },
    priority: 'high',
    url: 'https://linkedin.com/posts/mrodriguez/product-management'
  },
  {
    id: '3',
    author: {
      name: 'Emma Thompson',
      title: 'Head of Sales at Growth Co',
      avatar: '',
      initials: 'ET'
    },
    content: 'Cold email response rates are at an all-time low (0.5-1%). But here\'s what\'s working in 2024: Video messages, personalized landing pages, and social selling. The personal touch scales better than automation.',
    timestamp: '6 hours ago',
    engagement: { likes: 92, comments: 34, shares: 8 },
    priority: 'medium',
    url: 'https://linkedin.com/posts/ethompson/cold-email-strategies'
  }
];

export function Dashboard() {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getFeed();
      setPosts(response.posts || mockPosts);
    } catch (error) {
      console.error('Error loading feed:', error);
      // Fall back to mock data if API fails
      setPosts(mockPosts);
      toast.error('Could not load latest feed, showing demo data');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  if (selectedPost) {
    const post = posts.find(p => p.id === selectedPost);
    return (
      <CommentDrafts 
        post={post!} 
        onBack={() => setSelectedPost(null)}
        onComplete={() => setSelectedPost(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading opportunities...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Today's Opportunities</h2>
          <p className="text-muted-foreground">
            {posts.length} posts ready for commenting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Ranked by relevance
          </Badge>
          <Button variant="outline" size="sm" onClick={loadFeed}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{post.author.name}</h3>
                    <Badge variant={getPriorityColor(post.priority)} className="text-xs">
                      {post.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {post.author.title}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.timestamp}
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{post.engagement.likes} likes</span>
                      <span>{post.engagement.comments} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm mb-4 line-clamp-3">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">
                    High engagement
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(post.url, '_blank');
                    }}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setSelectedPost(post.id)}
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          That's all for now! Check back later for more opportunities.
        </p>
        <Button variant="outline">
          Refresh Feed
        </Button>
      </div>
    </div>
  );
}