import { NextRequest, NextResponse } from 'next/server'
import { JobDatabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const companies = await JobDatabase.getCompanies()
    return NextResponse.json(companies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}