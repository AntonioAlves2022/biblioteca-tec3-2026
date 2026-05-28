import { AppDataSource } from '../data-source'
import { Loan } from '../entities/loan'

export const loanRepository = AppDataSource.getRepository(Loan)