import { createClient } from '@supabase/supabase-js'
import { Company, Job, JobAttributes } from '@/types/job'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for frontend operations
export const supabase = createClient(supabaseUrl, supabaseKey)

// Admin client for server-side operations with elevated permissions
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types for OTP blacklist
export interface OtpBlacklist {
  id: number
  blacklisted_at: string
  expires_at: string
  contact_value: string
  contact_type: 'email' | 'phone'
  reason: string
}

// Database types for OTP codes table (matching actual schema)
export interface OtpCode {
  id: string // UUID
  user_id: string // UUID
  code: string // The OTP code
  type: 'email' | 'phone' // Type of verification
  expires_at: string
  attempts: number
  is_used: boolean
  created_at: string
  resend_count: number
  contact_value?: string
  contact_type?: string
}

// Job Database utilities
export class JobDatabase {
  
  // Get jobs with company and attributes
  static async getJobs(options: {
    page?: number
    limit?: number
    search?: string
    location?: string
    employmentTypes?: string[]
    recruitType?: string
    salaryMin?: number
    salaryMax?: number
    skills?: string[]
    companyNiche?: string
  } = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      employmentTypes,
      recruitType,
      salaryMin,
      salaryMax,
      skills,
      companyNiche
    } = options
    
    let query = supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        attributes:job_attributes(*)
      `, { count: 'exact' })
      .order('posted_date', { ascending: false })
    
    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,requirements.ilike.%${search}%`)
    }
    
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }
    
    if (employmentTypes && employmentTypes.length > 0) {
      query = query.in('employment_type', employmentTypes)
    }
    
    if (recruitType) {
      query = query.eq('recruit_type', recruitType)
    }
    
    if (salaryMin !== undefined) {
      // Job's max salary should be >= filter's min (job pays at least the minimum we want)
      query = query.gte('salary_max', salaryMin)
    }
    
    if (salaryMax !== undefined) {
      // Job's min salary should be <= filter's max (job starts within our budget)
      query = query.lte('salary_min', salaryMax)
    }
    
    if (companyNiche) {
      query = query.eq('company.niche', companyNiche)
    }
    
    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)
    
    const { data, error, count } = await query
    
    if (error) throw error
    
    return {
      jobs: data || [],
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > page * limit
    }
  }
  
  // Get job by ID with company and attributes
  static async getJob(jobId: number) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        attributes:job_attributes(*)
      `)
      .eq('job_id', jobId)
      .single()
    
    if (error) throw error
    return data
  }
  
  // Get all companies
  static async getCompanies() {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data as Company[]
  }
  
  // Create job
  static async createJob(job: Omit<Job, 'job_id' | 'posted_date'>, attributes?: Omit<JobAttributes, 'job_id'>) {
    const { data: jobData, error: jobError } = await supabaseAdmin
      .from('jobs')
      .insert([{
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        employment_type: job.employment_type,
        recruit_type: job.recruit_type,
        location: job.location,
        company_id: job.company_id
      }])
      .select()
      .single()
    
    if (jobError) throw jobError
    
    // If attributes provided, create them
    if (attributes) {
      const { error: attrError } = await supabaseAdmin
        .from('job_attributes')
        .insert([{
          job_id: jobData.job_id,
          hiring_manager: attributes.hiring_manager,
          skill_tags: attributes.skill_tags,
          additional_info: attributes.additional_info
        }])
      
      if (attrError) throw attrError
    }
    
    return jobData
  }
  
  // Update job
  static async updateJob(jobId: number, updates: Partial<Job>, attributeUpdates?: Partial<JobAttributes>) {
    const { data: jobData, error: jobError } = await supabaseAdmin
      .from('jobs')
      .update(updates)
      .eq('job_id', jobId)
      .select()
      .single()
    
    if (jobError) throw jobError
    
    // Update attributes if provided
    if (attributeUpdates) {
      const { error: attrError } = await supabaseAdmin
        .from('job_attributes')
        .upsert([{
          job_id: jobId,
          ...attributeUpdates
        }])
      
      if (attrError) throw attrError
    }
    
    return jobData
  }
  
  // Delete job
  static async deleteJob(jobId: number) {
    // Delete attributes first (foreign key constraint)
    await supabaseAdmin
      .from('job_attributes')
      .delete()
      .eq('job_id', jobId)
    
    const { error } = await supabaseAdmin
      .from('jobs')
      .delete()
      .eq('job_id', jobId)
    
    if (error) throw error
  }
}