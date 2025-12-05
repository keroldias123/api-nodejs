import fastify from "fastify";
import crypto from "node:crypto";
const app = fastify({logger: {
     transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
}});
const port = 3000 || process.env.PORT;
const host = '0.0.0.0';
const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
]

app.get('/', async (request, reply) => {
    return { hello: 'world' }
})

app.get('/courses', async (request, reply) => {
    return {courses}
})

app.put('/courses/:id', async (request, reply) => {
    type Params = {
        id: string
    }
    const params = request.params as Params
    const courseId = params.id
    const course = courses.find(course => course.id === courseId)           
    if(course){
       
        return {course}
    }
    return reply.status(404).send()
})

app.post('/courses', async (request, reply) => {
    type Body = {
        name: string
    }
    const body = request.body as Body
    const course = courses.push({id: crypto.randomUUID(), name: body.name})
    
    if(!course){
        return reply.status(400).send({error: 'Course name is required'})
    }
    return reply.status(201).send({course})
})

app.listen({port: port, host: host}).then(() => {
    console.log(`Server running on port http://localhost:${port}`)
})
