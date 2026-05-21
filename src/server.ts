import 'reflect-metadata'
import Fastify from 'fastify'
import { AppDataSource } from './data-source'
import { userRoutes } from './routes/user-routes'
import { booksRoutes } from './routes/books-routes'

const app = Fastify({logger:true})

/*
Antes de inicar a aplicação é
necessário iniciar o banco de dados
AppDataSource é um objeto assincrono
Então precisamos tratar ele como uma Promise
*/

AppDataSource.initialize().then(()=>{
    console.log('Banco de dados conectado!')
    
    //Registro de rotas e plugins:
    app.register(userRoutes)
    app.register(booksRoutes)
    app.get('/start',async ()=>{
        return {message: 'API Rest online'}
    })

    /*
    Servidor se conecta ao localhost através
    da porta 3333. Também é uma promise
    */
    app.listen({port:3333, host:'0.0.0.0'}).then(()=>{
        console.log('Servidor executando.')
    })
})