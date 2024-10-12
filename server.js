/* 
"type": "module" (Colocar no package.json)

npm install prisma --save-dev -> Instalar o prisma (Vincular com o MongoDB)
npx prisma init -> .env
npx prisma db push -> Executar depois que configurar o .env e o prisma.
npm install @prisma/client
npx prisma studio

node --watch server.js -> Executar o servidor.

npm install axios -> Linkar front com servidor (Back-end) 

npm install cors  

1- Query Params -> (servidor.com/usuarios?estado=bahia&cidade=salvador) -> Consultas e Filtragens.
2- Route Params -> (servidor.com/usuarios/22) -> Buscar, deletar ou editar algo específico.
3- Body Params -> {"nome": "Rodolfo", "id": 22} -> Enviar um arquivo JSON pelo body.

HTTP Métodos (rotas):                      HTTP Status:
    GET -> Listar, Mostrar                 2XX -> Sucesso
    POST -> Criar                          4XX -> Error Cliente
    PUT -> Editar vários                   5XX -> Error Servidor
    PATCH -> Editar um
    DELETE -> Deletar    
*/

import express, { request, response } from 'express'; // Importando o Express
import cors from 'cors' // Importando o Cors
import { PrismaClient } from '@prisma/client'; // Importando o Prisma

const prisma = new PrismaClient(); // Teremos tudo do Prisma por meio do 'prisma'.
const app = express(); // Teremos tudo do express por meio do 'app'.

app.use(express.json()); // Especificar ao express que vamos utilizar JSON / Converter o body para json

app.use(cors()); // Liberado para qualquer página acessar

/* 
Rotas precisam de duas coisas: 
1 - Tipo do método HTTP 
2 - Endereço (www.lojadoseuze.com/usuarios) -> /usuarios
*/ 

app.post('/usuarios', async (request, response) => {
    await prisma.user.create({ // Criando os Users
        data: {
            email: request.body.email,
            name: request.body.name,
            age: request.body.age
        }
    })
    response.status(201).json(request.body); // Enviando uma resposta.
})

app.get('/usuarios', async (request, response) => {
    let users = [];
    
    if (request.query) { // Se existir alguma filtragem no query.
        users = await prisma.user.findMany({
            where: {
                name: request.query.name,
                email: request.query.email,
                age: request.query.age
            }
        })
    } else {
        users = await prisma.user.findMany(); // Vai retornar os Users do BD na variável.
    }
    // response.send() // Enviar alguma resposta (texto).
    response.status(200).json(users); // Vai listar os usuarios como JSON com o status de sucesso.
});

app.put('/usuarios/:id', async (request, response) => { // /:id é uma variável com o valor atribuido no params
    await prisma.user.update({ // Editando os Users
        where: { // where -> Quem vai ser modificado??
            id: request.params.id
        },
        data: {
            email: request.body.email,
            name: request.body.name,
            age: request.body.age
        }
    })
    response.status(201).json(request.body); // Enviando uma resposta.
})

app.delete('/usuarios/:id', async (request, response) => {
    await prisma.user.delete({ // where -> Quem vai ser modificado??
        where: {
            id: request.params.id
        }
    })
    response.status(200).json({ message: "Usuário deletado com sucesso!"});
    //response.status(200).send('Usuário deletado com sucesso!');
})

app.listen(3000); // Qual porta do meu computador ele vai rodar. (localhost:3000/usuarios)