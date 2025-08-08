import { supabaseAdmin } from './supabase'

export interface CampusAmbassadorApplication {
  id?: string
  first_name: string
  last_name: string
  university: string
  faculty: string
  student_id: string
  graduation_year: string
  resume_filename?: string | null
  resume_file_path?: string | null
  resume_file_size?: number | null
  resume_mime_type?: string | null
  application_status?: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'withdrawn'
  language_preference?: 'en' | 'zh'
  user_agent?: string | null
  ip_address?: string | null
  created_at?: string
  updated_at?: string
}

export class CampusAmbassadorDB {
  
  // Create new campus ambassador application
  static async createApplication(application: Omit<CampusAmbassadorApplication, 'id' | 'created_at' | 'updated_at'>): Promise<CampusAmbassadorApplication> {
    const { data, error } = await supabaseAdmin
      .from('campus_ambassador_applications')
      .insert([{
        first_name: application.first_name,
        last_name: application.last_name,
        university: application.university,
        faculty: application.faculty,
        student_id: application.student_id,
        graduation_year: application.graduation_year,
        resume_filename: application.resume_filename,
        resume_file_path: application.resume_file_path,
        resume_file_size: application.resume_file_size,
        resume_mime_type: application.resume_mime_type,
        application_status: application.application_status || 'submitted',
        language_preference: application.language_preference || 'en',
        user_agent: application.user_agent,
        ip_address: application.ip_address
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Database error creating campus ambassador application:', error)
      throw new Error(error.message)
    }
    
    return data
  }
  
  // Get all applications with filtering and pagination
  static async getApplications(options: {
    status?: string
    limit?: number
    offset?: number
    university?: string
    graduation_year?: string
  } = {}) {
    const {
      status = 'submitted',
      limit = 50,
      offset = 0,
      university,
      graduation_year
    } = options
    
    let query = supabaseAdmin
      .from('campus_ambassador_applications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('application_status', status)
    }
    
    if (university) {
      query = query.ilike('university', `%${university}%`)
    }
    
    if (graduation_year) {
      query = query.eq('graduation_year', graduation_year)
    }
    
    // Apply pagination
    if (limit > 0) {
      query = query.range(offset, offset + limit - 1)
    }
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Database error getting campus ambassador applications:', error)
      throw new Error(error.message)
    }
    
    return {
      applications: data || [],
      total: count || 0,
      hasMore: (count || 0) > offset + limit
    }
  }
  
  // Get single application by ID
  static async getApplication(id: string): Promise<CampusAmbassadorApplication | null> {
    const { data, error } = await supabaseAdmin
      .from('campus_ambassador_applications')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      console.error('Database error getting campus ambassador application:', error)
      throw new Error(error.message)
    }
    
    return data
  }
  
  // Update application status
  static async updateApplicationStatus(id: string, status: CampusAmbassadorApplication['application_status']): Promise<CampusAmbassadorApplication> {
    const { data, error } = await supabaseAdmin
      .from('campus_ambassador_applications')
      .update({ 
        application_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Database error updating campus ambassador application status:', error)
      throw new Error(error.message)
    }
    
    return data
  }
  
  // Check if student has already applied (prevent duplicates)
  static async checkExistingApplication(studentId: string, university: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from('campus_ambassador_applications')
      .select('id')
      .eq('student_id', studentId)
      .eq('university', university)
      .neq('application_status', 'withdrawn')
      .limit(1)
    
    if (error) {
      console.error('Database error checking existing application:', error)
      throw new Error(error.message)
    }
    
    return (data && data.length > 0)
  }
  
  // Get application statistics for admin dashboard
  static async getApplicationStats() {
    const { data, error } = await supabaseAdmin
      .from('campus_ambassador_applications')
      .select('application_status, created_at, university, graduation_year')
    
    if (error) {
      console.error('Database error getting application stats:', error)
      throw new Error(error.message)
    }
    
    if (!data) return null
    
    // Process stats
    const stats = {
      total: data.length,
      byStatus: {} as Record<string, number>,
      byUniversity: {} as Record<string, number>,
      byGraduationYear: {} as Record<string, number>,
      recent: data.filter(app => {
        const appDate = new Date(app.created_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return appDate >= weekAgo
      }).length
    }
    
    // Count by status
    data.forEach(app => {
      stats.byStatus[app.application_status] = (stats.byStatus[app.application_status] || 0) + 1
      stats.byUniversity[app.university] = (stats.byUniversity[app.university] || 0) + 1
      stats.byGraduationYear[app.graduation_year] = (stats.byGraduationYear[app.graduation_year] || 0) + 1
    })
    
    return stats
  }
  
  // Delete application (admin only)
  static async deleteApplication(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('campus_ambassador_applications')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Database error deleting campus ambassador application:', error)
      throw new Error(error.message)
    }
  }
}