import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MessageSquare, Clock, Target, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../utils/api';
import { toast } from 'sonner@2.0.3';

const weeklyData = [
  { day: 'Mon', comments: 4, goal: 5 },
  { day: 'Tue', comments: 6, goal: 5 },
  { day: 'Wed', comments: 3, goal: 5 },
  { day: 'Thu', comments: 5, goal: 5 },
  { day: 'Fri', comments: 7, goal: 5 },
  { day: 'Sat', comments: 2, goal: 3 },
  { day: 'Sun', comments: 1, goal: 3 }
];

const timeToCommentData = [
  { day: 'Mon', avgTime: 8 },
  { day: 'Tue', avgTime: 12 },
  { day: 'Wed', avgTime: 6 },
  { day: 'Thu', avgTime: 15 },
  { day: 'Fri', avgTime: 9 },
  { day: 'Sat', avgTime: 25 },
  { day: 'Sun', avgTime: 18 }
];

const commentTypeData = [
  { name: 'Insight', value: 45, color: '#3b82f6' },
  { name: 'Question', value: 35, color: '#10b981' },
  { name: 'Compliment+Add', value: 20, color: '#f59e0b' }
];

export function Analytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getUserAnalytics();
      setAnalytics(response.analytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
      
      // Fall back to mock data
      setAnalytics({
        totalComments: 28,
        weeklyGoal: 35,
        avgApprovalRate: 73,
        avgTimeToComment: 11,
        dailyStreak: 12,
        weeklyData: [
          { day: 'Mon', comments: 4, goal: 5 },
          { day: 'Tue', comments: 6, goal: 5 },
          { day: 'Wed', comments: 3, goal: 5 },
          { day: 'Thu', comments: 5, goal: 5 },
          { day: 'Fri', comments: 7, goal: 5 },
          { day: 'Sat', comments: 2, goal: 3 },
          { day: 'Sun', comments: 1, goal: 3 }
        ],
        commentTypes: {
          insight: 45,
          question: 35,
          compliment: 20
        }
      });
      toast.error('Could not load analytics, showing demo data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  const { totalComments, weeklyGoal, avgApprovalRate, avgTimeToComment, weeklyData, commentTypes } = analytics;

  const commentTypeData = [
    { name: 'Insight', value: commentTypes.insight, color: '#3b82f6' },
    { name: 'Question', value: commentTypes.question, color: '#10b981' },
    { name: 'Compliment+Add', value: commentTypes.compliment, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">Analytics</h2>
        <p className="text-muted-foreground">
          Track your commenting performance and progress
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">This Week</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{totalComments}</span>
                <span className="text-sm text-muted-foreground">comments</span>
              </div>
              <Progress value={(totalComments / weeklyGoal) * 100} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                {totalComments}/{weeklyGoal} weekly goal
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Approval Rate</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{avgApprovalRate}%</span>
                <Badge variant="outline" className="text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Above 60% target
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Avg. Time</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{avgTimeToComment}</span>
                <span className="text-sm text-muted-foreground">min</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Ingest to copy
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Daily Streak</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">12</span>
                <span className="text-sm text-muted-foreground">days</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Meeting daily goals
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Comment Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Bar dataKey="comments" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="goal" fill="#e5e7eb" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Comments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span>Goal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time to Comment */}
        <Card>
          <CardHeader>
            <CardTitle>Average Time to Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.timeToCommentData || timeToCommentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Line 
                    type="monotone" 
                    dataKey="avgTime" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Target: ≤10 min (push), ≤30 min (digest)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comment Types & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Comment Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={commentTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {commentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {commentTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">First-pass approval</span>
                <span className="font-medium">73%</span>
              </div>
              <Progress value={73} className="h-2" />
              <p className="text-xs text-green-600">
                ✓ Above 60% target
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Daily goal completion</span>
                <span className="font-medium">86%</span>
              </div>
              <Progress value={86} className="h-2" />
              <p className="text-xs text-green-600">
                ✓ 6/7 days this week
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Push notification opt-out</span>
                <span className="font-medium">8%</span>
              </div>
              <Progress value={8} className="h-2" />
              <p className="text-xs text-green-600">
                ✓ Under 15% target
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm">5 comments today</p>
                  <p className="text-xs text-muted-foreground">Goal reached</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <div className="flex-1">
                  <p className="text-sm">3 pending approvals</p>
                  <p className="text-xs text-muted-foreground">In digest</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm">Approval rate up 5%</p>
                  <p className="text-xs text-muted-foreground">vs last week</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-900">Pilot Goals Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">
                  ≥3 comments/day: <strong>4.0 avg</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">
                  Time to copy: <strong>11 min avg</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">
                  First-pass approval: <strong>73%</strong>
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">
                  Active usage: <strong>86% days</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">
                  Push opt-out: <strong>8%</strong>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}