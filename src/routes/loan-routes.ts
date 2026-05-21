import {FastifyInstance} from 'fastify'
import { AppDataSource } from '../data-source'
import {IsNull} from 'typeorm'
import { Loan } from '../entities/loan'
import { User } from '../entities/user'
import { Book } from '../entities/book'

export function loanRoutes(app:FastifyInstance){
    const loanRepo = AppDataSource.getRepository(Loan)
    const userRepo = AppDataSource.getRepository(User)
    const bookRepo = AppDataSource.getRepository(Book)

    app.post('/loans', async(req, reply)=>{
        const body = req.body as {
            userId:number,
            bookId:number
        }
    // Validar usuario e livro de forma básica
    if(!body.userId || !body.bookId){
        return reply.code(404).send({
            error: 'Informe o userID e o bookID'
        })
    }

    // Buscar o usuario
    const usuario = await userRepo.findOneBy({
        id:body.userId
    })

    // Se o usuario não existir, mando catar coquinho
    if(!usuario){
        return reply.code(404).send({
            error:'Usuario inexistente'
        })
    }

    //Achei o usuario, vamos procurar o livro
    const livro = await bookRepo.findOneBy({
        id:body.bookId
    })

    // Se o livro não existir, lanço um erro.
    if(!livro){
        return reply.code(404).send({
            error:'Livro não encontrado'
        })
    }

    //Achei o livro, bola para a frente
    //Tenho exemplares do livro para emprestismo?
    if(livro.quantity <= 0){
        return reply.status(400).send({
            error:'Livro indisponivel.'
        })
    }

    // Verificar se usuario já tem emprestimo
    const emprestimoExistente = await loanRepo.findOne({
        where:{
            user:{id:usuario.id},
            book:{id: livro.id},
            returnDate: IsNull()
        },
        relations:['user', 'book']
    })


    })
}