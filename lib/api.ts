const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  status_code?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  per_page: number
  total: number
  message: string
}

export interface User {
  id: string
  username: string
  email?: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
  last_login?: string
}

export interface AuthResponse {
  user: User
  access_token: string
  token_type: string
}

export interface Poll {
  id: string
  title: string
  description?: string
  options: PollOption[]
  total_votes: number
  likes_count: number
  created_at: string
  updated_at: string
  is_active: boolean
  is_expired: boolean
  allow_multiple: boolean
  author_id?: string
}

export interface PollOption {
  id: string
  text: string
  vote_count: number
  poll_id: string
}

export interface Vote {
  id: string
  poll_id: string
  option_id: string
  user_id?: string
  anon_id?: string
  created_at: string
}

export interface VoteStats {
  poll_id: string
  total_votes: number
  unique_voters: number
  anonymous_votes: number
  authenticated_votes: number
  votes_by_option: Record<string, number>
  poll_total_votes: number
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'An error occurred',
          message: data.message || 'Request failed',
          status_code: response.status,
        }
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        status_code: response.status,
      }
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: 'Network error',
        message: 'Failed to connect to server',
        status_code: 0,
      }
    }
  }

  // Authentication endpoints
  async login(usernameOrEmail: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({
        username_or_email: usernameOrEmail,
        password,
      }),
    })
  }

  async register(username: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/api/users/me')
  }

  // Polls endpoints
  async getPolls(skip = 0, limit = 20): Promise<ApiResponse<PaginatedResponse<Poll>>> {
    return this.request<PaginatedResponse<Poll>>(`/api/polls?skip=${skip}&limit=${limit}`)
  }

  async getPoll(pollId: string): Promise<ApiResponse<Poll>> {
    return this.request<Poll>(`/api/polls/${pollId}`)
  }

  async createPoll(pollData: {
    title: string
    description?: string
    options: string[]
    allow_multiple?: boolean
  }): Promise<ApiResponse<Poll>> {
    return this.request<Poll>('/api/polls', {
      method: 'POST',
      body: JSON.stringify(pollData),
    })
  }

  // Vote endpoints
  async castVote(pollId: string, optionIds: string[], anonId?: string): Promise<ApiResponse<Vote[]>> {
    return this.request<Vote[]>('/api/votes', {
      method: 'POST',
      body: JSON.stringify({
        poll_id: pollId,
        option_ids: optionIds,
        anon_id: anonId,
      }),
    })
  }

  async getPollVotes(pollId: string, skip = 0, limit = 20): Promise<ApiResponse<PaginatedResponse<Vote>>> {
    return this.request<PaginatedResponse<Vote>>(`/api/votes/poll/${pollId}?skip=${skip}&limit=${limit}`)
  }

  async getPollStats(pollId: string): Promise<ApiResponse<VoteStats>> {
    return this.request<VoteStats>(`/api/votes/poll/${pollId}/stats`)
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health')
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(API_BASE_URL)

// Utility function to generate anonymous ID
export const generateAnonymousId = (): string => {
  return 'anon_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Utility function to get or create anonymous ID
export const getAnonymousId = (): string => {
  if (typeof window === 'undefined') return generateAnonymousId()
  
  let anonId = localStorage.getItem('anonymous_id')
  if (!anonId) {
    anonId = generateAnonymousId()
    localStorage.setItem('anonymous_id', anonId)
  }
  return anonId
}
