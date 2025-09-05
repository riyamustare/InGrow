import React, { useState } from 'react';
import { AuthWrapper, useAuth } from './components/AuthWrapper';
import { Dashboard } from './components/Dashboard';
import { CommentDrafts } from './components/CommentDrafts';
import { DailyDigest } from './components/DailyDigest';
import { FastLane } from './components/FastLane';
import { Settings } from './components/Settings';
import { Analytics } from './components/Analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { Bell, BarChart3, Settings2, Zap, List, LogOut, User } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [unreadCount] = useState(7);
  const [todayGoal] = useState({ current: 2, target: 5 });
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold">InGrow</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {todayGoal.current}/{todayGoal.target} today
              </Badge>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
              <div className="flex items-center gap-2 ml-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Feed</span>
            </TabsTrigger>
            <TabsTrigger value="digest" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Digest</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="w-2 h-2 p-0 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="fastlane" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Fast Lane</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="digest" className="mt-0">
            <DailyDigest />
          </TabsContent>
          
          <TabsContent value="fastlane" className="mt-0">
            <FastLane />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0">
            <Analytics />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <AuthWrapper>
        <AppContent />
      </AuthWrapper>
      <Toaster />
    </>
  );
}