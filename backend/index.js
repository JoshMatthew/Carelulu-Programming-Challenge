const express = require('express')
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const typeDefs = require('./schemas')
const resolvers = require('./resolvers')
const { sequelize } = require('./models')

async function startServer() {
    const app = express()

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        playground: false,
    })

    await server.start()
    const port = 4000;

    app.listen({ port }, () => {
        console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
    })

    sequelize.authenticate().then(() => {
        console.log('Database connected...')
    }).catch(err => {
        console.log('Error: ' + err)
    })
}   

startServer()