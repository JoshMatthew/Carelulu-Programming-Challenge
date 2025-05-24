export default `#graphql
    type Task {
        id: ID!
        task_title: String!
        task_description: String
        completed: Boolean
        createdAt: String!
        updatedAt: String!
    }

    type Query {
        allTask: [Task!]!
    }

    type Mutation {
        createTask(taskTitle: String!, taskDescription: String): Task!
        updateTask(id: ID!, taskTitle: String, taskDescription: String, completed: Boolean): Task!
        deleteTask(id: ID!): Task!
        deleteAllCompleted: Int!
    }
` as const;