import { NextRequest, NextResponse } from 'next/server'
import { consultations } from '@/lib/cms'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') as 'pending' | 'in_progress' | 'completed' | 'cancelled' | undefined
    const search = searchParams.get('search') || undefined

    const { data, error, count } = await consultations.getAll({
      status,
      limit,
      page
    })

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to fetch consultations' 
        },
        { status: 500 }
      )
    }

    // Filter by search if provided
    let filteredData = data || []
    if (search && filteredData.length > 0) {
      const searchLower = search.toLowerCase()
      filteredData = filteredData.filter(consultation => 
        consultation.name?.toLowerCase().includes(searchLower) ||
        consultation.phone?.toLowerCase().includes(searchLower) ||
        consultation.email?.toLowerCase().includes(searchLower) ||
        consultation.company?.toLowerCase().includes(searchLower)
      )
    }

    const totalPages = Math.ceil((count || 0) / limit)
    
    return NextResponse.json({
      success: true,
      data: filteredData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages
      }
    })
  } catch (error) {
    console.error('GET /api/consultation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, notes } = body

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'ID and status are required' },
        { status: 400 }
      )
    }

    const { data, error } = await consultations.updateStatus(id, status, notes)

    if (error) {
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : 'Failed to update consultation' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('PUT /api/consultation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await consultations.delete(id)

    if (error) {
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : 'Failed to delete consultation' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('DELETE /api/consultation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}