import { FastifyInstance } from "fastify";
import { AppDataSource } from "../data-source";
import { Book } from "../entities/book";

export async function booksRoutes(app:FastifyInstance){
    const repo = AppDataSource.getRepository(Book)

    //1. Cadastrar um livro
    app.post('/books', async(req, reply)=>{
        // Assim não precisamos informar o id
        const body = req.body as Partial<Book>

        //validação básica
        if(!body.title || !body.author){
            return reply
            .code(400)
            .send({error: 
                'Informe o titulo e o autor do livro'})
        }

        /* 
        Define os dados do livro com quantidade
        padrão 
        */
       const book = repo.create({
            title: body.title,
            author: body.author,
            quantity: body.quantity ?? 1
       })

       // 2. Salva os dados no banco de dados:
       await repo.save(book)

       //3. Retorna http status created (201)
       return reply.code(201).send(book)

    })

    // Listar todos os livros
    app.get('/books', async()=>{
        return repo.find()
    })

    // Buscar um livro por id
    app.get('/books/:id', async(req, reply)=>{
        //1. Identifico o id na URL (é um texto)
        const {id} = req.params as {id:string}
        //2. Transformo a string em numero
        const bookId = Number(id)
        //3. Verifica se é um número válido
        if(isNaN(bookId)){
            return reply
            .code(400)
            .send({error:'ID inválido'})
        }

        //4. Código válido, vamos buscar o livro no banco
        const book = repo.findOneBy({
            id: bookId
        })

        //5. Se eu não encontrar o livro
        if(!book){
            return reply
            .code(404)
            .send({error: 'Livro não encontrado'})
        }
        return book // O livro existe. Tá aqui!
    })
    
    /* Atualizar os dados do livro */
    app.put('/books/update/:id', async(req, reply)=>{
        //1. localiza o id do livro que será atualizado
        const {id} = req.params as {id: string}
        const bookId = Number(id)

        //2. Verifica se é um numero válido
        if(isNaN(bookId)){
            return reply.code(400).send({
                error: 'ID inválido.'
            })
        }
        //3. Busca o livro existente.
        const book = await repo.findOneBy({
            id:bookId
        })
        if(!book){
            return reply.code(404).send({
                error: 'Livro não encontrado'
            })
        }

        //4. Enviar os dados para atualização
        const body = req.body as Partial<Book>

        //5. Mescla dados antigos com os atuais
        //antes de realizar a atualização no banco
        repo.merge(book, {
            title: body.title,
            author: body.author,
            quantity: body.quantity
        })

        await repo.save(book)
        return book
    })

    /* Remover os livros */
    app.delete('/books/remove/:id', 
        async(req, reply)=>{
             //1. localiza o id do livro que será atualizado
        const {id} = req.params as {id: string}
        const bookId = Number(id)

        //2. Verifica se é um numero válido
        if(isNaN(bookId)){
            return reply.code(400).send({
                error: 'ID inválido.'
            }) 
        }
        const result = await repo.delete(bookId)

        //3. Verifica se removeu algo
        if(result.affected === 0){
            return reply.code(404)
            .send({
                error: 'Livro não encontrado'
            })
        }
        return reply.code(204).send()
        })
    
       

}