import { AppDataSource } from '../data-source'
import { Book } from '../entities/book'

export const bookRepository = AppDataSource.getRepository(Book)