import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Loan } from './loan'

@Entity()
export class Book{

    @PrimaryGeneratedColumn()
    id!:number

    @Column({type: 'text'})
    title!: string

    @Column({type: 'text'})
    author!: string

    @Column({type:'int', default:1})
    quantity!:number 

    @OneToMany(()=> Loan, loan => loan.book)
    loans!:Loan[]

}