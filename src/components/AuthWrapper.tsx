import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../utils/supabase/client';
import { apiClient } from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthWrapper');
  }
  return context;
}

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-lg">IG</span>
          </div>
          <CardTitle className="text-2xl">Welcome to InGrow</CardTitle>
          <p className="text-muted-foreground">
            Viral LinkedIn Commenting Platform
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 pt-6 border-t">
            <p className="text-center text-sm text-muted-foreground mb-2">
              Demo credentials: demo@ingrow.com / ingrow@123
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mb-2"
              onClick={() => {
                setEmail('demo@ingrow.com');
                setPassword('ingrow@123');
              }}
            >
              Use Demo Credentials
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already signed in
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email
          };
          setUser(userData);
          apiClient.setAccessToken(session.access_token);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email
        };
        setUser(userData);
        apiClient.setAccessToken(session.access_token);
      } else {
        setUser(null);
        apiClient.setAccessToken(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
      // If it's the demo user and sign in fails, try to create the demo user first
      if (email === 'demo@ingrow.com') {
        try {
          console.log('Setting up demo user...');
          await apiClient.setupDemoUser();
          console.log('Demo user setup completed');
        } catch (setupError) {
          console.log('Demo user setup result:', setupError);
          // Continue with sign in attempt even if setup fails (user might already exist)
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Supabase sign in error:', error);
        
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          if (email === 'demo@ingrow.com') {
            throw new Error('Demo user setup failed. Please try creating a new account or contact support.');
          } else {
            throw new Error('Invalid email or password. Please check your credentials or sign up for a new account.');
          }
        }
        
        throw new Error(error.message || 'Sign in failed');
      }

      if (data.session) {
        console.log('Sign in successful, setting access token');
        apiClient.setAccessToken(data.session.access_token);
      } else {
        throw new Error('No session returned from sign in');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting sign up for:', email);
      
      // Use our API endpoint for signup to ensure proper user creation
      const result = await apiClient.signup(email, password, name);
      console.log('Signup API result:', result);
      
      // Now sign in the user
      await signIn(email, password);
    } catch (error) {
      console.error('Sign up error:', error);
      
      // Provide better error messages for common issues
      if (error instanceof Error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          throw new Error('This email is already registered. Please try signing in instead.');
        }
        if (error.message.includes('weak password')) {
          throw new Error('Password is too weak. Please use at least 6 characters.');
        }
        if (error.message.includes('invalid email')) {
          throw new Error('Please enter a valid email address.');
        }
      }
      
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    apiClient.setAccessToken(null);
  };

  const authValue: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authValue}>
      {user ? children : <AuthForm />}
    </AuthContext.Provider>
  );
}