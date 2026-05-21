import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { User } from './user'
import { Book } from './book'


@Entity()
export class Loan{
    @PrimaryGeneratedColumn()
    id!:number
    /*
    Um usuário pode fazer vários empréstimos.
    Ainda não temos regra de negócio que bloqueie
    emprestimos para usuarios que possuam 
    empresetimos em aberto
    */
    @ManyToOne(()=>User, user=> user.loans,{onDelete:'CASCADE'})
    user!:User
    /*
    Um livro pode ser emprestado muitas vezes, ainda 
    não temos uma lógica para evitar empresetimos
    de livros que tem quantidade menor que 1.
    */
   @ManyToOne(()=> Book, book => book.loans, {onDelete:'CASCADE'})
    book!:Book
    loanDate!:Date
    returnDate!:Date
}