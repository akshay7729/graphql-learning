import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";
// ... or using `require()`
// const { GraphQLServer } = require('graphql-yoga')

const arr = [
  {
    id: "1",
    name: "Akshay",
    email: "aksh@gmail.com",
    age: 29,
  },
  {
    id: "2",
    name: "Rajat",
    email: "aksh@gmail.com",
    age: 29,
  },
  {
    id: "3",
    name: "Rohan",
    email: "aksh@gmail.com",
    age: 29,
  },
];

const postArr = [
  {
    id: "1",
    title: "GraphQL post",
    body: "This is a post",
    published: true,
    author: "1",
    comments: "1",
  },
  {
    id: "2",
    title: "GraphQL post",
    body: "This is a post",
    published: true,
    author: "1",
    comments: "2",
  },
  {
    id: "3",
    title: "GraphQL post",
    body: "This is a post",
    published: true,
    author: "2",
    comments: "3",
  },
];

const comments = [
  {
    id: "1",
    title: "Comment 1",
    author: "1",
    post: "1",
  },
  {
    id: "2",
    title: "Comment 2",
    author: "2",
    post: "2",
  },
  {
    id: "3",
    title: "Comment 3",
    author: "3",
    post: "3",
  },
];

const typeDefs = `
  type Query {
    greeting(name: String): String
    users(query: String): [User!]!
    posts: [Post!]!
    me: User
    post: Post
    comments: [Comment!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int!): User!
    createPost(title: String!, body: String!, published: Boolean, author: ID!): Post!
    createComment(title: String, author: ID!, post: ID!): Comment!
  }

  type User {
      id: ID!,
      name: String,
      email: String,
      age: Int,
      posts: [Post!]!
      comments: [Comment]!
  }

  type Post {
      id: ID!,
      title: String,
      body: String,
      published: Boolean,
      author: User!
      comments: [Comment!]!
  }

  type Comment {
      id: ID!,
      title: String
      author: User!
      post: Post!
  }
`;

const resolvers = {
  Query: {
    greeting: (parent, args, ctx, info) => {
      return args.name ? `Hello ${args.name}` : `Hello`;
    },

    users: (parent, args, ctx, info) => {
      if (!args.query) {
        return arr;
      }

      return arr.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },

    me: () => {
      return {
        id: "1123123",
        name: "Akshay",
        email: "akshay@pwc.com",
        age: 29,
      };
    },

    posts: (parent, args, ctx, info) => {
      if (!args.query) {
        return postArr;
      }

      return postArr.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return isTitleMatch || isBodyMatch;
      });
    },

    comments: () => {
      return comments;
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = arr.some((user) => user.email === args.email);
      if (emailTaken) {
        throw new Error("Email taken");
      }

      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        age: args.age,
      };

      arr.push(user);
      return user;
      console.log("args", args);
    },
    createPost(parent, args, ctx, info) {
      const userExists = arr.some((user) => user.id === args.author);
      if (!userExists) {
        throw new Error("User not found");
      }

      const post = {
        id: uuidv4(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author,
      };

      postArr.push(post);
      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = arr.some((user) => user.id === args.author);
      const postExists = postArr.some((post) => post.id === args.post);
      if (!postExists) {
        throw new Error("Post not found");
      }
      if (!userExists) {
        throw new Error("user not found");
      }

      const comment = {
        id: uuidv4(),
        title: args.title,
        author: args.autho,
        post: args.post,
      };

      comments.push(comment);
      return comment;
    },
  },
  Post: {
    author: (parent, args, ctx, info) => {
      return arr.find((user) => {
        return user.id === parent.author;
      });
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts: (parent, args, ctx, info) => {
      return postArr.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author: (parent, args, ctx, info) => {
      return comments.find((user) => {
        return user.id === parent.author;
      });
    },
    post: (parent, args, ctx, info) => {
      return postArr.find((post) => {
        return post.id === parent.post;
      });
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running on localhost:4000"));
