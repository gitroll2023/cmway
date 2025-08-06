import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Request validation schema
const contactRequestSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다').max(50, '이름은 50자를 초과할 수 없습니다'),
  phone: z.string().min(10, '연락처는 10자 이상이어야 합니다').max(15, '연락처는 15자를 초과할 수 없습니다'),
  email: z.string().email('올바른 이메일 형식이 아닙니다').optional().or(z.literal('')),
  subject: z.string().min(1, '문의 유형을 선택해주세요'),
  message: z.string().min(10, '문의 내용은 10자 이상이어야 합니다').max(2000, '문의 내용은 2000자를 초과할 수 없습니다'),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Validate request data
    const validatedData = contactRequestSchema.parse(body)

    // Get client IP and user agent for tracking
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Insert contact request
    const { data, error } = await supabase
      .from('contact_requests')
      .insert({
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email || null,
        subject: validatedData.subject,
        message: validatedData.message,
        status: 'pending',
        ip_address: ip,
        user_agent: userAgent,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: '문의사항 저장에 실패했습니다.' },
        { status: 500 }
      )
    }

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to customer
    // TODO: Integrate with customer service system

    // Log activity
    try {
      await supabase
        .from('activity_logs')
        .insert({
          entity_type: 'contact_request',
          entity_id: data.id,
          entity_name: `문의 - ${validatedData.name}`,
          action: 'created',
          changes: {
            subject: validatedData.subject,
            message: validatedData.message.substring(0, 100) + (validatedData.message.length > 100 ? '...' : ''),
          },
          ip_address: ip,
          user_agent: userAgent,
          created_at: new Date().toISOString(),
        })
    } catch (logError) {
      console.error('Activity log error:', logError)
      // Don't fail the request if logging fails
    }

    return NextResponse.json(
      {
        success: true,
        message: '문의가 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.',
        data: {
          id: data.id,
          status: data.status
        }
      },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: '입력 정보가 올바르지 않습니다.',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const subject = searchParams.get('subject')

    let query = supabase
      .from('contact_requests')
      .select('*', { count: 'exact' })

    // Filter by status
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Filter by subject
    if (subject && subject !== 'all') {
      query = query.eq('subject', subject)
    }

    // Search by name, phone, email, or message
    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`)
    }

    // Pagination
    const offset = (page - 1) * limit
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: '문의사항 목록을 불러올 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Contact GET API error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}