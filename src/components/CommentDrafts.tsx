import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Copy, Edit3, CheckCircle, Lightbulb, MessageCircle, Heart, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { apiClient } from '../utils/api';

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

interface CommentVariant {
  id: string;
  type: 'insight' | 'question' | 'compliment';
  label: string;
  content: string;
  icon: React.ReactNode;
}

interface CommentDraftsProps {
  post: Post;
  onBack: () => void;
  onComplete: () => void;
}

export function CommentDrafts({ post, onBack, onComplete }: CommentDraftsProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [commentVariants, setCommentVariants] = useState<CommentVariant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateComments();
  }, [post]);

  const generateComments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.generateComments(
        post.id,
        post.content,
        post.author.name
      );
      
      const variants = response.variants.map((variant: any) => ({
        ...variant,
        icon: getVariantIcon(variant.type)
      }));
      
      setCommentVariants(variants);
    } catch (error) {
      console.error('Error generating comments:', error);
      
      // Fall back to mock variants
      const mockVariants: CommentVariant[] = [
        {
          id: '1',
          type: 'insight',
          label: 'Add Insight',
          icon: <Lightbulb className="w-4 h-4" />,
          content: `This aligns perfectly with what we're seeing in the market. The insights you've shared here are game-changing. We implemented a similar approach and saw comparable results.`
        },
        {
          id: '2',
          type: 'question',
          label: 'Ask Question',
          icon: <MessageCircle className="w-4 h-4" />,
          content: `Impressive insights, ${post.author.name}! I'm curious about your implementation approach - what were the key challenges you faced during rollout?`
        },
        {
          id: '3',
          type: 'compliment',
          label: 'Compliment + Add',
          icon: <Heart className="w-4 h-4" />,
          content: `Love seeing real insights behind implementations! 🎯 Your approach reminds me of what we've seen work at other companies. Thanks for sharing the specifics!`
        }
      ];
      
      setCommentVariants(mockVariants);
      toast.error('Using demo comments - API unavailable');
    } finally {
      setLoading(false);
    }
  };

  const getVariantIcon = (type: string) => {
    switch (type) {
      case 'insight': return <Lightbulb className="w-4 h-4" />;
      case 'question': return <MessageCircle className="w-4 h-4" />;
      case 'compliment': return <Heart className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const handleApproveAndCopy = async (content: string, variantType?: string, wasEdited: boolean = false) => {
    try {
      await navigator.clipboard.writeText(content);
      
      // Track the approval
      try {
        await apiClient.approveComment(post.id, content, variantType || 'unknown', wasEdited);
      } catch (error) {
        console.error('Error tracking approval:', error);
      }
      
      toast.success('Comment copied to clipboard!', {
        description: 'LinkedIn post will open in a new tab'
      });
      
      // Open LinkedIn post
      window.open(post.url, '_blank');
      
      // Mark as completed
      setTimeout(() => {
        onComplete();
      }, 1000);
    } catch (error) {
      toast.error('Failed to copy comment');
    }
  };

  const handleEdit = (variant: CommentVariant) => {
    setSelectedVariant(variant.id);
    setEditedContent(variant.content);
    setIsEditing(true);
  };

  const handleEditAndCopy = async () => {
    const variant = commentVariants.find(v => v.id === selectedVariant);
    await handleApproveAndCopy(editedContent, variant?.type, true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Comment Drafts</h2>
          <p className="text-sm text-muted-foreground">
            Choose a variant or edit to match your voice
          </p>
        </div>
      </div>

      {/* Original Post */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{post.author.name}</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.open(post.url, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {post.author.title}
              </p>
              <p className="text-sm">
                {post.content}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Comment Variants */}
      {!isEditing && (
        <div className="space-y-4">
          <h3 className="font-medium">Choose Your Comment Style</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Generating comment variants...</span>
            </div>
          ) : (
            commentVariants.map((variant) => (
            <Card key={variant.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {variant.icon}
                  <CardTitle className="text-base">{variant.label}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {variant.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 leading-relaxed">
                  {variant.content}
                </p>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleApproveAndCopy(variant.content, variant.type)}
                  >
                    <Copy className="w-3 h-3 mr-2" />
                    Approve & Copy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(variant)}
                  >
                    <Edit3 className="w-3 h-3 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
          )}
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h3 className="font-medium">Edit Your Comment</h3>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="Edit your comment..."
                rows={6}
                className="mb-4"
              />
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleEditAndCopy}
                  disabled={!editedContent.trim()}
                >
                  <Copy className="w-3 h-3 mr-2" />
                  Copy & Post
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Skip Option */}
      {!isEditing && (
        <div className="text-center py-4 border-t">
          <Button variant="ghost" onClick={onBack}>
            Skip This Post
          </Button>
        </div>
      )}
    </div>
  );
}