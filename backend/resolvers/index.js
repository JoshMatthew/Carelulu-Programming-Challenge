const {Item} = require('../models')

const resolvers = {
    Query: {
        allTask: async () => await Item.findAll(),
    },
    Mutation: {
        createTask: async (_, { name, description }) => {
            const item = await Item.create({ name, description })
            return item
        },
    }
}

module.exports = resolvers