/**
 * NocoDB REST API client
 * Reemplaza la capa de datos hardcodeada.
 * Todos los componentes del dashboard deben importar desde aquí.
 */

const NOCODB_URL = process.env.NOCODB_URL!
const TOKEN = process.env.NOCODB_TOKEN!
const BASE_ID = process.env.NOCODB_BASE_ID!

// Table IDs
export const TABLES = {
  hotels:        process.env.TABLE_HOTELS!,
  cycles:        process.env.TABLE_CYCLES!,
  findings:      process.env.TABLE_FINDINGS!,
  recommendations: process.env.TABLE_RECOMMENDATIONS!,
  reviews:       process.env.TABLE_REVIEWS!,
  reviewSources: process.env.TABLE_REVIEW_SOURCES!,
  offers:        process.env.TABLE_HOTEL_OFFERS!,
  socialPosts:   process.env.TABLE_SOCIAL_POSTS!,
  metrics:       process.env.TABLE_METRICS!,
  context:       process.env.TABLE_CONTEXT!,
} as const

export const DEMO_HOTEL_ID = process.env.DEMO_HOTEL_ID ?? '1'

type QueryParams = {
  where?: string
  sort?: string
  limit?: number
  offset?: number
  fields?: string
}

async function nocoFetch<T>(
  tableId: string,
  params: QueryParams = {}
): Promise<T[]> {
  const url = new URL(`${NOCODB_URL}/api/v1/db/data/noco/${BASE_ID}/${tableId}`)
  if (params.where)  url.searchParams.set('where', params.where)
  if (params.sort)   url.searchParams.set('sort', params.sort)
  if (params.limit)  url.searchParams.set('limit', String(params.limit))
  if (params.offset) url.searchParams.set('offset', String(params.offset))
  if (params.fields) url.searchParams.set('fields', params.fields)

  const res = await fetch(url.toString(), {
    headers: { 'xc-token': TOKEN },
    next: { revalidate: 30 }, // cache 30s, fácil de ajustar
  })

  if (!res.ok) throw new Error(`NocoDB error ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data.list ?? []
}

async function nocoGet<T>(tableId: string, id: number | string): Promise<T> {
  const res = await fetch(
    `${NOCODB_URL}/api/v1/db/data/noco/${BASE_ID}/${tableId}/${id}`,
    { headers: { 'xc-token': TOKEN }, next: { revalidate: 30 } }
  )
  if (!res.ok) throw new Error(`NocoDB error ${res.status}`)
  return res.json()
}

async function nocoUpdate(
  tableId: string,
  id: number | string,
  fields: Record<string, unknown>
): Promise<void> {
  await fetch(`${NOCODB_URL}/api/v1/db/data/noco/${BASE_ID}/${tableId}/${id}`, {
    method: 'PATCH',
    headers: { 'xc-token': TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })
}

// ---------------------------------------------------------------------------
// Domain queries
// ---------------------------------------------------------------------------

export async function getHotel(hotelId = DEMO_HOTEL_ID) {
  return nocoGet<Record<string, unknown>>(TABLES.hotels, hotelId)
}

export async function getLatestCycle(hotelId = DEMO_HOTEL_ID) {
  const cycles = await nocoFetch<Record<string, unknown>>(TABLES.cycles, {
    where: `(hotel_id,eq,${hotelId})`,
    sort: '-Id',
    limit: 1,
  })
  return cycles[0] ?? null
}

export async function getAllCycles(hotelId = DEMO_HOTEL_ID) {
  return nocoFetch<Record<string, unknown>>(TABLES.cycles, {
    where: `(hotel_id,eq,${hotelId})`,
    sort: '-Id',
    limit: 20,
  })
}

export async function getFindings(hotelId = DEMO_HOTEL_ID) {
  return nocoFetch<Record<string, unknown>>(TABLES.findings, {
    where: `(hotel_id,eq,${hotelId})`,
    sort: '-Id',
    limit: 100,
  })
}

export async function getRecommendations(hotelId = DEMO_HOTEL_ID) {
  return nocoFetch<Record<string, unknown>>(TABLES.recommendations, {
    where: `(hotel_id,eq,${hotelId})`,
    sort: '-priority',
    limit: 100,
  })
}

export async function updateRecommendation(
  id: number | string,
  fields: { status?: string; notes?: string }
) {
  return nocoUpdate(TABLES.recommendations, id, fields)
}

export async function getReviews(hotelId = DEMO_HOTEL_ID) {
  return nocoFetch<Record<string, unknown>>(TABLES.reviews, {
    where: `(hotel_id,eq,${hotelId})`,
    sort: '-review_date',
    limit: 100,
  })
}

export async function getOffers(hotelId = DEMO_HOTEL_ID) {
  return nocoFetch<Record<string, unknown>>(TABLES.offers, {
    where: `(hotel_id,eq,${hotelId})`,
    sort: 'offer_type',
    limit: 50,
  })
}

export async function getSocialPosts(hotelId = DEMO_HOTEL_ID) {
  return nocoFetch<Record<string, unknown>>(TABLES.socialPosts, {
    where: `(hotel_id,eq,${hotelId})`,
    sort: '-post_date',
    limit: 50,
  })
}

export async function getMetrics(hotelId = DEMO_HOTEL_ID) {
  return nocoFetch<Record<string, unknown>>(TABLES.metrics, {
    where: `(hotel_id,eq,${hotelId})`,
    sort: '-period_from',
    limit: 100,
  })
}

export async function getCommercialContext(hotelId = DEMO_HOTEL_ID) {
  const rows = await nocoFetch<Record<string, unknown>>(TABLES.context, {
    where: `(hotel_id,eq,${hotelId})`,
    sort: '-Id',
    limit: 1,
  })
  return rows[0] ?? null
}
