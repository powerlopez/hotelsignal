import { NextRequest, NextResponse } from 'next/server'

const NOCODB_URL = process.env.NOCODB_URL!
const TOKEN = process.env.NOCODB_TOKEN!
const BASE_ID = process.env.NOCODB_BASE_ID!
const TABLE = process.env.TABLE_RECOMMENDATIONS!

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const res = await fetch(
    `${NOCODB_URL}/api/v1/db/data/noco/${BASE_ID}/${TABLE}/${id}`,
    {
      method: 'PATCH',
      headers: { 'xc-token': TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
