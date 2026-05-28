import {z} from 'zod'

export const createBookSchema = z.object({
    title: z.string().min(3),
    author: z.string().min(3),
    quantity: z.number().min(1)
})