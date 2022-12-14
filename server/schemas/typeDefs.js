const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    thoughts: [Thought]!
    friends: [User]
  }

  type Thought {
    _id: ID
    thoughtText: String
    username: String
    createdAt: String
    reactions: [Reaction]!
  }

  type Reaction {
    _id: ID
    reactionText: String
    username: String
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Friend {
    _id: ID
    userId: String
    friendId: String
    username: String
    friend: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(thoughtId: ID!): Thought
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addThought(thoughtText: String!): Thought
    addReaction(thoughtId: ID!, reactionText: String!): Thought
    removeThought(_id: String): Thought
    removeReaction(
      thoughtId: ID
      reactionId: ID): Thought
    addFriend(
      userId: ID 
      friendId: ID
      username: String): Friend
    removeFriend(
      userId: ID
      friendId: ID): Friend
  }
`;

module.exports = typeDefs;
