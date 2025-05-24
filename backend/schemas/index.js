const typeDefs = `#graphql
    type Item {
        id: ID!
        name: String!
        description: String
        createdAt: String!
        updatedAt: String!
    }
    
    type Query {
        allItems: [Item!]!
    }

    type Mutation {
        createItem(name: String!, description: String!): Item!
    }
`

module.exports = typeDefs