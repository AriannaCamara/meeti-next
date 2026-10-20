import { meeti, meetiLocations } from "@/src/db/schema"
import { FullMeeti, InsertMeeti, InsertMeetiLocation, SelectMeeti } from "../types/meeti.types"
import { db } from "@/src/db"
import { format } from "date-fns"
import { and, asc, eq, gt, gte, ilike, inArray, or, type SQL } from "drizzle-orm"


export interface IMeetiRepository {
    insert(data: InsertMeeti) : Promise<void>
    findUpcomingByUserId(userId: string) : Promise<SelectMeeti[]>
    findUpcoming() : Promise<SelectMeeti[]>
    findById(id: string) : Promise<SelectMeeti | null>
    findFullById(id: string) : Promise<FullMeeti | null>
    update(data: InsertMeeti, meetiId: string) : Promise<void>
    findUpcomingByCommunity(communityId: string) : Promise<SelectMeeti[]>
    findByCategory(categoryId: string) : Promise<SelectMeeti[]>
    delete(meetiId: string) : Promise<void>
    searchByTopic(query: string) : Promise<SelectMeeti[]>
    searchVirtual(query?: string) : Promise<SelectMeeti[]>
    searchByLocation(query?: string, city?: string, country?: string, today?: boolean) : Promise<SelectMeeti[]>
}
class MeetiRepository implements IMeetiRepository {
    async insert(data: InsertMeeti): Promise<void> {
        // location no es columna de la tabla meetis, se inserta aparte
        const { location, ...meetiData } = data
        const [insertedMeeti] = await db.insert(meeti).values(meetiData).returning()

        if(!insertedMeeti.virtual && location) {
            await this.insertLocation({
                meetiId: insertedMeeti.id,
                ...location
            })
        }
    }

    async insertLocation(data: InsertMeetiLocation) {
        await db.insert(meetiLocations).values(data)
    }
    
    async findUpcomingByUserId(userId: string): Promise<SelectMeeti[]> {
        const today = format(new Date(), 'yyyy-MM-dd')
        const result = await db.query.meeti.findMany({
            where: and(
                eq(meeti.createdBy, userId),
                gte(meeti.date, today)
            ),
            orderBy: [asc(meeti.date)]
        })
        return result
    }

    async findUpcoming(): Promise<SelectMeeti[]> {
        const now = new Date()
        const nowDate = now.toISOString().slice(0, 10)
        const nowTime = now.toTimeString().slice(0, 5)

        const result = await db.query.meeti.findMany({
            where: or(
                gt(meeti.date, nowDate),
                and(
                    eq(meeti.date, nowDate),
                    gte(meeti.time, nowTime)
                )
            ),
            orderBy: [asc(meeti.date), asc(meeti.time)],
            limit: 3
        })
        return result
    }

    async findById(id: string) {
        const result = await db.query.meeti.findFirst({
            where: eq(meeti.id, id),
            with: {
                location: true
            }
        })
        return result ?? null
    }

    async findFullById(id: string) {
        const result = await db.query.meeti.findFirst({
            where: eq(meeti.id, id),
            with: {
                location: true,
                category: true,
                community: true,
                admin: true
            }
        })
        return result ?? null
    }

    async update(data: InsertMeeti, meetiId: string): Promise<void> {
        // location no es columna de la tabla meetis, se actualiza aparte
        const { location, ...meetiData } = data
        const[updatedMeeti] =  await db
            .update(meeti)
            .set(meetiData)
            .where(eq(meeti.id, meetiId))
            .returning()

        // Actualizar ubicacion si el evento es presencial 
        if(!updatedMeeti.virtual && location) {

            const locationExists = await db.query.meetiLocations.findFirst({
                where: eq(meetiLocations.meetiId, updatedMeeti.id)
            })
            if(locationExists) {
                await db
                .update(meetiLocations)
                .set(location)
                .where(eq(meetiLocations.meetiId, updatedMeeti.id))
            } else {
                await this.insertLocation({ meetiId: updatedMeeti.id, ...location })
            }
        }
    }

    async findUpcomingByCommunity(communityId: string): Promise<SelectMeeti[]> {
        const today =  format(new Date(), 'yyyy-MM-dd')

        return db.query.meeti.findMany({
            where: and(
                eq(meeti.communityId, communityId),
                gte(meeti.date, today)
            ),
            limit: 3,
            orderBy: [asc(meeti.date)]
        })
    }

    async findByCategory(categoryId: string): Promise<SelectMeeti[]> {
        const today = format(new Date(), 'yyyy-MM-dd')
        const result = await db.query.meeti.findMany({
            where: and(
                eq(meeti.categoryId, categoryId),
                gte(meeti.date, today)
            ),
            orderBy: [asc(meeti.date)],
            limit: 10
        })
        return result
    }

    async delete(meetiId: string): Promise<void> {
        await db.delete(meeti).where(eq(meeti.id, meetiId))
    }

    async searchByTopic(query: string): Promise<SelectMeeti[]> {
        const pattern = `%${query}%`
        const meetis = await db.query.meeti.findMany({
            where: or(
                ilike(meeti.title, pattern),
                ilike(meeti.details, pattern)
            )
        })
        return meetis
    }

    async searchVirtual(query?: string): Promise<SelectMeeti[]> {
        const normalizedQuery = query?.toLowerCase().trim()

        const isToday = normalizedQuery?.includes('hoy') 

        let cleanQuery = normalizedQuery
        if(isToday) {
            cleanQuery = cleanQuery?.replace('hoy', '').trim()
        }
        const today = format(new Date(), 'yyyy-MM-dd')

        const filters: SQL[] = [eq(meeti.virtual, true)]
        if(isToday) filters.push(eq(meeti.date, today))
        if(cleanQuery && cleanQuery.length > 0) {
            const pattern = `%${cleanQuery}%`
            const textFilter = or(
                ilike(meeti.title, pattern),
                ilike(meeti.details, pattern)
            )
            if(textFilter) filters.push(textFilter)
        }

        const meetis = await db.query.meeti.findMany({
            where: and(...filters),
            limit: 5,
            orderBy: [asc(meeti.date)]
        })
        return meetis
    }

    async searchByLocation(query?: string, city?: string, country?: string, today?: boolean): Promise<SelectMeeti[]> {
        const normalizedQuery = query?.toLowerCase().trim()

        const isTodayInQuery = normalizedQuery?.includes('hoy')
        const isToday = today || isTodayInQuery 
        let cleanQuery = normalizedQuery
        if(isToday) {
            cleanQuery = cleanQuery?.replace('hoy', '').trim()
        }
        const todayStr = format(new Date(), 'yyyy-MM-dd')

        const meetiFilters: SQL[] = [eq(meeti.virtual, false)]
        if(isToday) meetiFilters.push(eq(meeti.date, todayStr))
        if(cleanQuery && cleanQuery.length > 0) {
            const pattern = `%${cleanQuery}%`
            const textFilter = or(
                ilike(meeti.title, pattern),
                ilike(meeti.details, pattern)
            )
            if(textFilter) meetiFilters.push(textFilter)
        }

        const meetiIds = db
            .select({ id: meeti.id })
            .from(meeti)
            .where(and(...meetiFilters))
            .as('meeti_ids')

        const locationFilters: SQL[] = [inArray(meetiLocations.meetiId, meetiIds)]
        if(city) locationFilters.push(ilike(meetiLocations.city, `%${city}%`))
        if(country) locationFilters.push(ilike(meetiLocations.country, `%${country}%`))

        const locations = await db.query.meetiLocations.findMany({
            where: and(...locationFilters),
            with: {
                meeti: true
            },
            limit: 5
        })
        return locations.map(location => location.meeti)
    }
}

export const meetiRepository = new MeetiRepository()
