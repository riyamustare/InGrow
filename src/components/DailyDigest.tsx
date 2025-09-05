import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { CommentDrafts } from './CommentDrafts';
import { CheckCircle2, Clock, TrendingUp, MessageSquare, Target } from 'lucide-react';

interface DigestPost {
  id: string;
  author: {
    name: string;
    title: string;
    avatar: string;
    initials: string;
  };
  content: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  engagement: {
    likes: number;
    comments: number;
  };
  url: string;
}

const digestPosts: DigestPost[] = [
  {
    id: '1',
    author: {
      name: 'Alex Rivera',
      title: 'CTO at InnovateLab',
      avatar: '',
      initials: 'AR'
    },
    content: 'The future of software development is not about writing more code, it\'s about writing less. AI-assisted coding tools are helping us focus on architecture and problem-solving rather than syntax.',
    timestamp: '8 hours ago',
    priority: 'high',
    engagement: { likes: 445, comments: 89 },
    url: 'https://linkedin.com/posts/arivera/ai-coding-future'
  },
  {
    id: '2',
    author: {
      name: 'Lisa Park',
      title: 'VP of Product at DataFlow',
      avatar: '',
      initials: 'LP'
    },
    content: 'After analyzing 1000+ user interviews, here are the top 3 mistakes product teams make: 1) Asking leading questions, 2) Not interviewing enough churned users, 3) Confusing feature requests with actual needs.',
    timestamp: '10 hours ago',
    priority: 'high',
    engagement: { likes: 234, comments: 67 },
    url: 'https://linkedin.com/posts/lpark/user-research-mistakes'
  },
  {
    id: '3',
    author: {
      name: 'David Kim',
      title: 'Head of Growth at StartupZ',
      avatar: '',
      initials: 'DK'
    },
    content: 'Growth hack of the day: We increased our trial-to-paid conversion by 23% simply by changing our onboarding email sequence from 5 emails over 7 days to 3 emails over 14 days. Sometimes less is more.',
    timestamp: '12 hours ago',
    priority: 'medium',
    engagement: { likes: 178, comments: 45 },
    url: 'https://linkedin.com/posts/dkim/growth-hack-onboarding'
  },
  {
    id: '4',
    author: {
      name: 'Rachel Santos',
      title: 'Marketing Director at TechScale',
      avatar: '',
      initials: 'RS'
    },
    content: 'B2B content marketing lesson: Our most successful piece wasn\'t about our product at all. It was a deep-dive into industry benchmarks. Lesson: Provide value first, sell second.',
    timestamp: '14 hours ago',
    priority: 'medium',
    engagement: { likes: 156, comments: 34 },
    url: 'https://linkedin.com/posts/rsantos/content-marketing-strategy'
  },
  {
    id: '5',
    author: {
      name: 'James Wilson',
      title: 'Sales Operations at CloudTech',
      avatar: '',
      initials: 'JW'
    },
    content: 'Sales pipeline reality check: 70% of deals that stall in the "decision" stage never close. The fix? Better discovery calls that uncover the real decision-making process upfront.',
    timestamp: '16 hours ago',
    priority: 'low',
    engagement: { likes: 89, comments: 23 },
    url: 'https://linkedin.com/posts/jwilson/sales-pipeline-tips'
  }
];

export function DailyDigest() {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [completedPosts, setCompletedPosts] = useState<string[]>([]);
  
  const todayTarget = 5;
  const completed = completedPosts.length;
  const progress = (completed / todayTarget) * 100;

  const handleComplete = (postId: string) => {
    setCompletedPosts(prev => [...prev, postId]);
    setSelectedPost(null);
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
    const post = digestPosts.find(p => p.id === selectedPost);
    return (
      <CommentDrafts 
        post={post!} 
        onBack={() => setSelectedPost(null)}
        onComplete={() => handleComplete(selectedPost)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Daily Digest</h2>
            <p className="text-muted-foreground">
              Your curated commenting opportunities
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            {digestPosts.length - completed} remaining
          </Badge>
        </div>

        {/* Progress Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Today's Progress</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Comments completed
                </span>
                <span className="font-medium">
                  {completed} / {todayTarget}
                </span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                {completed >= todayTarget 
                  ? "🎉 Daily goal achieved! Great work!" 
                  : `${todayTarget - completed} more comments to reach your daily goal`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Digest Posts */}
      <div className="space-y-4">
        <h3 className="font-medium">Today's Opportunities</h3>
        {digestPosts.map((post) => {
          const isCompleted = completedPosts.includes(post.id);
          
          return (
            <Card key={post.id} className={`${isCompleted ? 'opacity-50' : 'hover:shadow-md'} transition-all`}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{post.author.name}</h3>
                      <Badge variant={getPriorityColor(post.priority)} className="text-xs">
                        {post.priority}
                      </Badge>
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {post.author.title}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                      Trending
                    </span>
                  </div>
                  
                  {!isCompleted ? (
                    <Button 
                      size="sm"
                      onClick={() => setSelectedPost(post.id)}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Comment
                    </Button>
                  ) : (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      {completed >= todayTarget && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-medium text-green-900 mb-2">
                Daily Goal Achieved! 🎉
              </h3>
              <p className="text-sm text-green-700">
                You've completed {completed} comments today. Great work building your LinkedIn presence!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}