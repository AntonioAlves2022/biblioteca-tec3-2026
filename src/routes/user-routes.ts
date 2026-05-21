import {FastifyInstance} from 'fastify'
import { AppDataSource } from '../data-source'
import { User } from '../entities/user'

export async function userRoutes(app:FastifyInstance){
    const repo = AppDataSource.getRepository(User)

    // Create User (Crud)
    app.post('/users', async (req,reply)=>{
        const {name, email, password} = req.body as {name:string, email:string, password:string}
        const user = repo.create({name, email, password})
        await repo.save(user)
        return reply.code(201).send(user)
    })

    //Read all (cRud) 
    app.get('/users', async()=>{
        return repo.find()
    })

    //Read One (cRud)
    app.get('/users/:id', async(req,reply)=>{
        const {id} = req.params as {id:string}
        const user = await repo.findOneBy({id:Number(id)})

        if(!user){
            return reply.code(404).send({error:'Not found'})
        }

        return user
    })

    // Update user (crUd)
    app.put('/users/update/:id', async(req,reply)=>{
        const {id} = req.params as {id: string}
        const data = req.body as Partial<User>

        const user = await repo.findOneBy({id:Number(id)})

        if(!user) return reply.code(404).send({error:'Not found'})
        repo.merge(user, data)
        await repo.save(user)
        return user
    })

    // Delete user (cruD)
    app.delete('/users/remove/:id', async(req,reply)=>{
         const {id} = req.params as {id: string}
         const result = await repo.delete(Number(id))

         if(result.affected === 0){
            return reply.code(404).send({error:'Not found'})
         }

         return reply.code(204).send()

    })
}