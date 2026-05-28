import {loanRepository} from '../repositories/loan-repository'
import { bookRepository } from '../repositories/book-repository'

export class CreateLoanService{
    async execute(userId:number, bookId:number){
        //1. Verifica se o usuario já tem um emprestimo aberto
        const emprestimoAberto = await loanRepository.findOne({
            where:{
                user:{id:userId}, 
                returned:false 
            }
        
        })

        //2. Se houver emprestimo lança um erro
        if(emprestimoAberto){
            throw new Error('Já existe um emprestimo em aberto para este usuário')
        }

        //3. Se o livro não exisitir no acervo
        const livro = await bookRepository.findOneBy({
            id:bookId
        })

        if(!livro){
            throw new Error('Livro não encontrado')
        }

        //3. O livro está disponivel?
        if(livro.quantity <= 0){
            throw new Error('Livro indisponivel')
        }

        //determinamos a devolução em 14 dias
        const dataDevolucao = new Date()
        dataDevolucao.setDate(dataDevolucao.getDate()+14)

        const emprestimo =  loanRepository.create({
            user:{id:userId},
            book:{id:bookId},
            dueDate:dataDevolucao
        })
        // atualizando o estoque.
        livro.quantity -= 1
        await bookRepository.save(livro)
        
        //confirmando o emprestimo
        return await loanRepository.save(emprestimo)
    }
}