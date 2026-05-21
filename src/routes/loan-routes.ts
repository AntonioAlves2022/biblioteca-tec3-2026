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

    if(emprestimoExistente){
        return reply.code(400).send({
            error:'Usuario já possui emprestimo'
        })
    }

    // Diminuo a quantidade de livros no acervo
    livro.quantity -= 1
    await bookRepo.save(livro) // atualizo o 'estoque'

    //Agora finalmente crio o emprestimo
    const emprestimo = loanRepo.create({
        user: usuario,
        book: livro
    })

    // Salvando o emprestimo
    await loanRepo.save(emprestimo)
    //retorna uma resposta:
    return reply.code(201).send({
        message: 'Emprestimo realizado'
    })
    })

    //Listagem de emprestimos
    app.get('/loans', async() =>{
        const emprestimos = await loanRepo.find({
            relations:['user', 'book']
        })
        return emprestimos
    })

    //Devolução do livro
    app.patch('/loans/:id/return', async(req, reply)=>{
        //localiza o id do emprestimo
        const params = req.params as {id:string}

        //Busca no banco de dados o emprestimo
        const emprestimo = await loanRepo.findOne({
            where:{id:Number(params.id)},
            relations:['book']
        })

        if(!emprestimo){
            return reply.code(404).send({
                error:'Emprestimo não encontrado'
            })
        }
        //Verificar se o livro já foi devolvido
        if(emprestimo.returnDate){
            return reply.code(400).send({
                error:'Livro já foi devolvido'
            })
        }

        // Registrar a devolução do livro
        emprestimo.returnDate = new Date()
        // Voltar o livro para o acervo
        emprestimo.book.quantity +=1
        //Atualiza o acervo
        await bookRepo.save(emprestimo.book)
        //Registra a devolução
        await loanRepo.save(emprestimo)

        return reply.send({
            message:'Livro devolvido com sucesso!'
        })

    })
}