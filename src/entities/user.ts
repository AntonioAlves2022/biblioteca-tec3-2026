import {
    Entity, // gerar a tabela
    PrimaryGeneratedColumn, // chave primaria
    Column, // coluna
    CreateDateColumn, // coluna de data
    OneToMany
} from 'typeorm'
import { Loan } from './loan';

@Entity() //CREATE TABLE user(id int primary key auto_increment,name varchar(40));
export class User{
    
    @PrimaryGeneratedColumn()
    id!:number; //! significa que o valor será definido em runtime

    @Column({type:'text', length:40})
    name!: string

    @Column({type:'text', unique: true, nullable:false})
    email!: string

    @Column({type:'text'})
    password!: string

    @Column({type:'text', default:'USER'})
    role!:'ADMIN'|'USER'
    
    @OneToMany(()=> Loan, loan=>loan.book)
    loans!:Loan[]

    @CreateDateColumn()
    createdAt!: Date
}