import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Bell, Users, Target, Clock, Plus, X, Settings2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TrackedProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  initials: string;
  priority: 'high' | 'medium' | 'low';
  lastPost: string;
}

const trackedProfiles: TrackedProfile[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'VP of Marketing at TechCorp',
    avatar: 'https://images.unsplash.com/photo-1738750908048-14200459c3c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMGxpbmtlZGlufGVufDF8fHx8MTc1NzA0NzYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    initials: 'SC',
    priority: 'high',
    lastPost: '2 hours ago'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    title: 'CEO at StartupX',
    avatar: '',
    initials: 'MR',
    priority: 'high',
    lastPost: '4 hours ago'
  },
  {
    id: '3',
    name: 'Emma Thompson',
    title: 'Head of Sales at Growth Co',
    avatar: '',
    initials: 'ET',
    priority: 'medium',
    lastPost: '6 hours ago'
  }
];

export function Settings() {
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    digestEnabled: true,
    reminderEnabled: true,
    maxPushPerDay: 2
  });

  const [goals, setGoals] = useState({
    dailyComments: 5,
    weeklyComments: 35
  });

  const [newProfileUrl, setNewProfileUrl] = useState('');

  const handleSaveNotifications = () => {
    toast.success('Notification settings saved');
  };

  const handleSaveGoals = () => {
    toast.success('Goal settings saved');
  };

  const handleAddProfile = () => {
    if (!newProfileUrl.trim()) {
      toast.error('Please enter a LinkedIn profile URL');
      return;
    }

    if (!newProfileUrl.includes('linkedin.com')) {
      toast.error('Please enter a valid LinkedIn URL');
      return;
    }

    toast.success('Profile added to tracking list');
    setNewProfileUrl('');
  };

  const handleRemoveProfile = (profileId: string) => {
    toast.success('Profile removed from tracking');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Settings2 className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Settings</h2>
          <p className="text-muted-foreground">
            Manage your tracking, notifications, and goals
          </p>
        </div>
      </div>

      {/* Tracked Profiles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Tracked Profiles ({trackedProfiles.length}/20)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Profile */}
          <div className="space-y-2">
            <Label>Add LinkedIn Profile</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://www.linkedin.com/in/username/"
                value={newProfileUrl}
                onChange={(e) => setNewProfileUrl(e.target.value)}
              />
              <Button onClick={handleAddProfile}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Current Profiles */}
          <div className="space-y-3">
            {trackedProfiles.map((profile) => (
              <div key={profile.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <Avatar>
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>{profile.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{profile.name}</h4>
                    <Badge variant={getPriorityColor(profile.priority)} className="text-xs">
                      {profile.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{profile.title}</p>
                  <p className="text-xs text-muted-foreground">Last post: {profile.lastPost}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveProfile(profile.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified of high-value commenting opportunities
                </p>
              </div>
              <Switch
                checked={notifications.pushEnabled}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, pushEnabled: checked }))
                }
              />
            </div>

            {notifications.pushEnabled && (
              <div className="ml-4 space-y-2">
                <Label>Max push notifications per day</Label>
                <Select
                  value={notifications.maxPushPerDay.toString()}
                  onValueChange={(value) => 
                    setNotifications(prev => ({ ...prev, maxPushPerDay: parseInt(value) }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Daily Digest</Label>
                <p className="text-sm text-muted-foreground">
                  Morning summary of commenting opportunities
                </p>
              </div>
              <Switch
                checked={notifications.digestEnabled}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, digestEnabled: checked }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>End-of-day Reminder</Label>
                <p className="text-sm text-muted-foreground">
                  Reminder if daily goal not met
                </p>
              </div>
              <Switch
                checked={notifications.reminderEnabled}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, reminderEnabled: checked }))
                }
              />
            </div>
          </div>

          <Button onClick={handleSaveNotifications} className="w-full">
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Goal Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Daily Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Daily comments target</Label>
              <Select
                value={goals.dailyComments.toString()}
                onValueChange={(value) => 
                  setGoals(prev => ({ ...prev, dailyComments: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 comments</SelectItem>
                  <SelectItem value="5">5 comments</SelectItem>
                  <SelectItem value="7">7 comments</SelectItem>
                  <SelectItem value="10">10 comments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Weekly comments target</Label>
              <Select
                value={goals.weeklyComments.toString()}
                onValueChange={(value) => 
                  setGoals(prev => ({ ...prev, weeklyComments: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20 comments</SelectItem>
                  <SelectItem value="35">35 comments</SelectItem>
                  <SelectItem value="50">50 comments</SelectItem>
                  <SelectItem value="70">70 comments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSaveGoals} className="w-full">
            Save Goal Settings
          </Button>
        </CardContent>
      </Card>

      {/* Time Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Time Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Digest delivery time</Label>
              <Select defaultValue="08:00">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="07:00">7:00 AM</SelectItem>
                  <SelectItem value="08:00">8:00 AM</SelectItem>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reminder time</Label>
              <Select defaultValue="18:00">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="17:00">5:00 PM</SelectItem>
                  <SelectItem value="18:00">6:00 PM</SelectItem>
                  <SelectItem value="19:00">7:00 PM</SelectItem>
                  <SelectItem value="20:00">8:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full">
            Save Time Settings
          </Button>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Pilot start date</span>
              <p className="font-medium">January 15, 2024</p>
            </div>
            <div>
              <span className="text-muted-foreground">Days active</span>
              <p className="font-medium">21 days</p>
            </div>
            <div>
              <span className="text-muted-foreground">Total comments</span>
              <p className="font-medium">127 comments</p>
            </div>
            <div>
              <span className="text-muted-foreground">Success rate</span>
              <p className="font-medium">73% approval</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}