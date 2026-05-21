import 'reflect-metadata'
import {DataSource} from 'typeorm'
import {User} from './entities/user'
import { Book } from './entities/book'
import { Loan } from './entities/loan'

export const AppDataSource = new DataSource({
    type:'sqlite',
    database: 'db.sqlite',
    synchronize: true,
    entities:[User, Book, Loan]
})