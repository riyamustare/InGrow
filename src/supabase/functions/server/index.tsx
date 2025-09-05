import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))
app.use('*', logger(console.log))

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Auth endpoints
app.post('/make-server-842023ed/auth/signup', async (c) => {
  try {
    const body = await c.req.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400)
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (error) {
      console.log('Signup error:', error)
      
      // Provide specific error messages
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        return c.json({ error: 'This email is already registered. Please try signing in instead.' }, 409)
      }
      if (error.message.includes('weak password')) {
        return c.json({ error: 'Password is too weak. Please use at least 6 characters.' }, 400)
      }
      if (error.message.includes('invalid email')) {
        return c.json({ error: 'Please enter a valid email address.' }, 400)
      }
      
      return c.json({ error: error.message }, 400)
    }

    // Store user preferences
    await kv.set(`user:${data.user.id}:preferences`, {
      dailyGoal: 5,
      weeklyGoal: 35,
      pushEnabled: true,
      digestEnabled: true,
      reminderEnabled: true,
      maxPushPerDay: 2
    })

    return c.json({ user: data.user })
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

// Posts endpoints
app.get('/make-server-842023ed/posts/feed', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Invalid authorization' }, 401)
    }

    // Get user's tracked profiles
    const trackedProfiles = await kv.get(`user:${user.id}:tracked_profiles`) || []
    
    // Get recent posts (in a real implementation, this would fetch from LinkedIn API)
    const feedPosts = await kv.get(`user:${user.id}:feed_posts`) || [
      {
        id: '1',
        author: {
          name: 'Sarah Chen',
          title: 'VP of Marketing at TechCorp',
          avatar: '',
          initials: 'SC'
        },
        content: 'Just launched our new AI-powered customer service platform. The results after 30 days are incredible: 40% reduction in response time, 25% increase in customer satisfaction.',
        timestamp: '2 hours ago',
        engagement: { likes: 284, comments: 67, shares: 23 },
        priority: 'high',
        url: 'https://linkedin.com/posts/sarahchen/ai-customer-service',
        score: 95
      },
      {
        id: '2',
        author: {
          name: 'Michael Rodriguez',
          title: 'CEO at StartupX',
          avatar: '',
          initials: 'MR'
        },
        content: 'Unpopular opinion: The best product managers are not the ones with the most features shipped, but the ones who kill the most features before they get built.',
        timestamp: '4 hours ago',
        engagement: { likes: 156, comments: 89, shares: 12 },
        priority: 'high',
        url: 'https://linkedin.com/posts/mrodriguez/product-management',
        score: 87
      }
    ]

    return c.json({ posts: feedPosts, totalCount: feedPosts.length })
  } catch (error) {
    console.log('Feed error:', error)
    return c.json({ error: 'Error fetching feed' }, 500)
  }
})

app.post('/make-server-842023ed/posts/analyze', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Invalid authorization' }, 401)
    }

    const body = await c.req.json()
    const { url } = body

    if (!url || !url.includes('linkedin.com')) {
      return c.json({ error: 'Valid LinkedIn URL required' }, 400)
    }

    // In a real implementation, this would scrape the LinkedIn post
    // For now, return mock analyzed post
    const analyzedPost = {
      id: `fastlane-${Date.now()}`,
      author: {
        name: 'Jennifer Martinez',
        title: 'Senior Product Designer at UXCorp',
        avatar: '',
        initials: 'JM'
      },
      content: 'Design systems aren\'t just about components and tokens. They\'re about creating a shared language between design and engineering.',
      timestamp: '30 minutes ago',
      engagement: { likes: 127, comments: 34, shares: 8 },
      priority: 'high' as const,
      url: url,
      score: 92
    }

    // Store the analyzed post
    await kv.set(`user:${user.id}:fastlane:${analyzedPost.id}`, analyzedPost)

    return c.json({ post: analyzedPost })
  } catch (error) {
    console.log('Analyze error:', error)
    return c.json({ error: 'Error analyzing post' }, 500)
  }
})

// Comments endpoints
app.post('/make-server-842023ed/comments/generate', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Invalid authorization' }, 401)
    }

    const body = await c.req.json()
    const { postId, postContent, authorName } = body

    if (!postId || !postContent) {
      return c.json({ error: 'Post ID and content required' }, 400)
    }

    // Generate AI comment variants (mock implementation)
    const commentVariants = [
      {
        id: '1',
        type: 'insight',
        label: 'Add Insight',
        content: `This aligns perfectly with what we're seeing in the market. The insights you've shared here are game-changing. We implemented a similar approach and saw comparable results.`,
        confidence: 0.87
      },
      {
        id: '2',
        type: 'question',
        label: 'Ask Question',
        content: `Impressive results, ${authorName}! I'm curious about your implementation approach - what were the key challenges you faced during rollout?`,
        confidence: 0.92
      },
      {
        id: '3',
        type: 'compliment',
        label: 'Compliment + Add',
        content: `Love seeing real metrics behind implementations! 🎯 Your approach reminds me of what we've seen work at other companies. Thanks for sharing the specifics!`,
        confidence: 0.85
      }
    ]

    // Store generated comments
    await kv.set(`user:${user.id}:comments:${postId}`, {
      postId,
      variants: commentVariants,
      generatedAt: new Date().toISOString()
    })

    return c.json({ variants: commentVariants })
  } catch (error) {
    console.log('Generate comments error:', error)
    return c.json({ error: 'Error generating comments' }, 500)
  }
})

app.post('/make-server-842023ed/comments/approve', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Invalid authorization' }, 401)
    }

    const body = await c.req.json()
    const { postId, commentContent, variantType, wasEdited } = body

    if (!postId || !commentContent) {
      return c.json({ error: 'Post ID and comment content required' }, 400)
    }

    const approvalRecord = {
      postId,
      commentContent,
      variantType,
      wasEdited: wasEdited || false,
      approvedAt: new Date().toISOString(),
      userId: user.id
    }

    // Store approval
    await kv.set(`user:${user.id}:approvals:${postId}`, approvalRecord)

    // Update daily stats
    const today = new Date().toISOString().split('T')[0]
    const dailyKey = `user:${user.id}:daily:${today}`
    const dailyStats = await kv.get(dailyKey) || { comments: 0, approvals: 0 }
    
    dailyStats.approvals += 1
    await kv.set(dailyKey, dailyStats)

    // Update analytics
    await updateUserAnalytics(user.id, {
      type: 'comment_approved',
      variantType,
      wasEdited,
      timestamp: new Date().toISOString()
    })

    return c.json({ success: true, approvalRecord })
  } catch (error) {
    console.log('Approve comment error:', error)
    return c.json({ error: 'Error approving comment' }, 500)
  }
})

// Analytics endpoints
app.get('/make-server-842023ed/analytics/user', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Invalid authorization' }, 401)
    }

    // Get user analytics data
    const analytics = await kv.get(`user:${user.id}:analytics`) || {
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
    }

    return c.json({ analytics })
  } catch (error) {
    console.log('Analytics error:', error)
    return c.json({ error: 'Error fetching analytics' }, 500)
  }
})

// Settings endpoints
app.put('/make-server-842023ed/settings/preferences', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Invalid authorization' }, 401)
    }

    const body = await c.req.json()
    const { preferences } = body

    if (!preferences) {
      return c.json({ error: 'Preferences object required' }, 400)
    }

    // Update user preferences
    await kv.set(`user:${user.id}:preferences`, preferences)

    return c.json({ success: true, preferences })
  } catch (error) {
    console.log('Update preferences error:', error)
    return c.json({ error: 'Error updating preferences' }, 500)
  }
})

// Tracked profiles endpoints
app.post('/make-server-842023ed/profiles/track', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return c.json({ error: 'Invalid authorization' }, 401)
    }

    const body = await c.req.json()
    const { profileUrl } = body

    if (!profileUrl || !profileUrl.includes('linkedin.com')) {
      return c.json({ error: 'Valid LinkedIn profile URL required' }, 400)
    }

    // In a real implementation, this would scrape the LinkedIn profile
    const mockProfile = {
      id: `profile-${Date.now()}`,
      name: 'New Tracked Profile',
      title: 'Professional Title',
      avatar: '',
      initials: 'NT',
      priority: 'medium',
      url: profileUrl,
      addedAt: new Date().toISOString()
    }

    // Get current tracked profiles
    const trackedProfiles = await kv.get(`user:${user.id}:tracked_profiles`) || []
    
    // Add new profile (limit to 20)
    if (trackedProfiles.length >= 20) {
      return c.json({ error: 'Maximum 20 profiles allowed' }, 400)
    }

    trackedProfiles.push(mockProfile)
    await kv.set(`user:${user.id}:tracked_profiles`, trackedProfiles)

    return c.json({ success: true, profile: mockProfile })
  } catch (error) {
    console.log('Track profile error:', error)
    return c.json({ error: 'Error tracking profile' }, 500)
  }
})

// Helper function to update analytics
async function updateUserAnalytics(userId: string, event: any) {
  try {
    const analyticsKey = `user:${userId}:analytics`
    const analytics = await kv.get(analyticsKey) || {}
    
    // Update based on event type
    if (event.type === 'comment_approved') {
      analytics.totalApprovals = (analytics.totalApprovals || 0) + 1
      analytics.lastApprovalRate = analytics.totalApprovals / (analytics.totalGenerated || 1)
    }
    
    await kv.set(analyticsKey, analytics)
  } catch (error) {
    console.log('Analytics update error:', error)
  }
}

// Setup demo user endpoint
app.post('/make-server-842023ed/setup/demo-user', async (c) => {
  try {
    const demoEmail = 'demo@ingrow.com'
    const demoPassword = 'ingrow@123'
    const demoName = 'Demo User'

    console.log('Setting up demo user:', demoEmail)

    // Check if demo user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const demoUserExists = existingUsers.users.some(user => user.email === demoEmail)

    if (demoUserExists) {
      console.log('Demo user already exists')
      return c.json({ success: true, message: 'Demo user already exists' })
    }

    // Create demo user
    const { data, error } = await supabase.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      user_metadata: { name: demoName },
      email_confirm: true
    })

    if (error) {
      console.error('Demo user creation error:', error)
      return c.json({ error: error.message }, 400)
    }

    console.log('Demo user created successfully:', data.user.id)

    // Store demo user preferences
    await kv.set(`user:${data.user.id}:preferences`, {
      dailyGoal: 5,
      weeklyGoal: 35,
      pushEnabled: true,
      digestEnabled: true,
      reminderEnabled: true,
      maxPushPerDay: 2
    })

    // Add some demo data
    await kv.set(`user:${data.user.id}:analytics`, {
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
    })

    return c.json({ success: true, message: 'Demo user created successfully', userId: data.user.id })
  } catch (error) {
    console.error('Demo user setup error:', error)
    return c.json({ error: 'Failed to setup demo user' }, 500)
  }
})

// Health check
app.get('/make-server-842023ed/health', (c) => {
  return c.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    env: {
      supabase_url: !!Deno.env.get('SUPABASE_URL'),
      service_role_key: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    }
  })
})

// Start server
serve(app.fetch)