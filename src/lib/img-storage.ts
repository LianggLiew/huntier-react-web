import { supabase } from './supabase'

// Storage bucket names
export const STORAGE_BUCKETS = {
  COMPANY_LOGOS: 'company-logos',
  COMPANY_PHOTOS: 'company-photos', 
  UNIVERSITY_LOGOS: 'university-logos',
  AVATARS: 'avatars'
} as const

// Image storage utility class
export class ImageStorage {
  
  // Get public URL for an image
  static getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  }

  // Get company logo URL
  static getCompanyLogo(filename: string): string {
    return this.getPublicUrl(STORAGE_BUCKETS.COMPANY_LOGOS, filename)
  }

  // Get company team photo URL
  static getCompanyPhoto(filename: string): string {
    return this.getPublicUrl(STORAGE_BUCKETS.COMPANY_PHOTOS, filename)
  }

  // Get university logo URL
  static getUniversityLogo(filename: string): string {
    return this.getPublicUrl(STORAGE_BUCKETS.UNIVERSITY_LOGOS, filename)
  }

  // Get avatar URL
  static getAvatar(filename: string): string {
    return this.getPublicUrl(STORAGE_BUCKETS.AVATARS, filename)
  }

  // Upload image to storage
  static async uploadImage(
    bucket: string, 
    path: string, 
    file: File,
    options?: {
      cacheControl?: string
      upsert?: boolean
    }
  ) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: options?.cacheControl || '3600',
        upsert: options?.upsert || false
      })

    if (error) throw error
    return data
  }

  // Delete image from storage
  static async deleteImage(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  }

  // List files in a bucket
  static async listFiles(bucket: string, folder?: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder)

    if (error) throw error
    return data
  }
}