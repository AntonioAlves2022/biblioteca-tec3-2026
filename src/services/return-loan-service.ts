import {loanRepository} from '../repositories/loan-repository'
import { bookRepository } from '../repositories/book-repository'

export class ReturnLoanService{

    async execute(loanId:number){
        const emprestimo = await loanRepository.findOne({
            where:{id: loanId},
            relations:['book']
        })

        //2. Se não encontrar o emprestimo dá erro
        if(!emprestimo){
            throw new Error('Empréstimo não encontrado')
        }

        //3.Emprestimo já retornou??
        if(emprestimo.returned){
            throw new Error('Empréstimo já finalizado')
        }

        //Calcular o valor da multa
        const hoje = new Date() // pega a data atual
        let multa = 0

        if(hoje > emprestimo.dueDate){
            const atraso = hoje.getTime() - emprestimo.dueDate.getTime()
            const diasAtraso = Math.ceil(atraso/(1000 * 60 * 60 * 24))
            multa = diasAtraso * 2.50

        }

        emprestimo.returned = true
        emprestimo.returnDate = hoje
        emprestimo.fine = multa
        emprestimo.book.quantity +=1

        //atualiza os livros
        await bookRepository.save(emprestimo.book)
        //atualiza o status do emprestimo
        await loanRepository.save(emprestimo)

    }
}