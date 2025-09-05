import { projectId, publicAnonKey } from './supabase/info'

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-842023ed`

class ApiClient {
  private accessToken: string | null = null

  setAccessToken(token: string | null) {
    this.accessToken = token
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.accessToken || publicAnonKey}`,
      ...options.headers as Record<string, string>
    }

    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making API request to:', url);
    console.log('Headers:', headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || `HTTP ${response.status}`);
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      }

      const result = await response.json();
      console.log('API success response:', result);
      return result;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async signup(email: string, password: string, name: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    })
  }

  // Posts methods
  async getFeed() {
    return this.request('/posts/feed')
  }

  async analyzePost(url: string) {
    return this.request('/posts/analyze', {
      method: 'POST',
      body: JSON.stringify({ url })
    })
  }

  // Comments methods
  async generateComments(postId: string, postContent: string, authorName: string) {
    return this.request('/comments/generate', {
      method: 'POST',
      body: JSON.stringify({ postId, postContent, authorName })
    })
  }

  async approveComment(postId: string, commentContent: string, variantType: string, wasEdited: boolean = false) {
    return this.request('/comments/approve', {
      method: 'POST',
      body: JSON.stringify({ postId, commentContent, variantType, wasEdited })
    })
  }

  // Analytics methods
  async getUserAnalytics() {
    return this.request('/analytics/user')
  }

  // Settings methods
  async updatePreferences(preferences: any) {
    return this.request('/settings/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences })
    })
  }

  // Profiles methods
  async trackProfile(profileUrl: string) {
    return this.request('/profiles/track', {
      method: 'POST',
      body: JSON.stringify({ profileUrl })
    })
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }

  async setupDemoUser() {
    return this.request('/setup/demo-user', { method: 'POST' })
  }
}

export const apiClient = new ApiClient()
export default apiClient