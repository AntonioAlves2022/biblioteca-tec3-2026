import {
    Entity, // gerar a tabela
    PrimaryGeneratedColumn, // chave primaria
    Column, // coluna
    CreateDateColumn, // coluna de data
    OneToMany
} from 'typeorm'
import { Loan } from './loan';

@Entity()
export class User{
    
    @PrimaryGeneratedColumn()
    id!:number; //! significa que o valor será definido em runtime

    @Column({type:'text'})
    name!: string

    @Column({type:'text', unique: true, nullable:false})
    email!: string

    @Column({type:'text'})
    password!: string
    
    @OneToMany(()=> Loan, loan=>loan.book)
    loans!:Loan[]

    @CreateDateColumn()
    createdAt!: Date
}