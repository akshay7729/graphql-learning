import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";
import db from "./db";

const resolvers = {
  Query: {
    users: (parent, args, { db }, info) => {
      if (!args.query) {
        return db.arr;
      }

      return db.arr.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },

    posts: (parent, args, { db }, info) => {
      if (!args.query) {
        return db.postArr;
      }

      return db.postArr.filter((post) => {
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
    createUser(parent, args, { db }, info) {
      const emailTaken = db.arr.some((user) => user.email === args.data.email);
      if (emailTaken) {
        throw new Error("Email taken");
      }

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      db.arr.push(user);
      return user;
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.arr.findIndex((user) => user.id === args.id);
      if (userIndex === -1) {
        throw new Error("User is not found");
      }
      const deletedUsers = db.arr.splice(userIndex, 1);

      // remove all assocaited posts
      db.postArr = db.postArr.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          db.comments = db.comments.filter(
            (comment) => comment.post !== post.id
          );
        }

        return !match;
      });

      db.comments = db.comments.filter((comment) => comment.author !== args.id);

      // remove all associated comments

      return deletedUsers[0];
    },

    deletePost(parent, args, { db }, info) {
      const postIndex = db.postArr.findIndex((post) => post.id === args.id);
      if (postIndex === -1) {
        throw new Error("Post doesnt exists");
      }

      const deletedPosts = db.postArr.splice(postIndex, 1);

      db.comments = db.comments.filter((comment) => comment.post !== args.id);

      return deletedPosts[0];
    },

    deleteComment(parent, args, { db }, info) {
      const commentIndex = db.comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error("Comment doesnt exists");
      }

      const deletedComments = db.comments.splice(commentIndex, 1);

      return deletedComments[0];
    },

    createPost(parent, args, { db }, info) {
      const userExists = db.arr.some((user) => user.id === args.data.author);
      if (!userExists) {
        throw new Error("User not found");
      }

      const post = {
        id: uuidv4(),
        ...args.data,
      };

      db.postArr.push(post);
      return post;
    },
    createComment(parent, args, { db }, info) {
      const userExists = db.arr.some((user) => user.id === args.data.author);
      const postExists = db.postArr.some((post) => post.id === args.data.post);
      if (!postExists) {
        throw new Error("Post not found");
      }
      if (!userExists) {
        throw new Error("user not found");
      }

      const comment = {
        id: uuidv4(),
        ...args.data,
      };

      db.comments.push(comment);
      return comment;
    },
  },
  Post: {
    author: (parent, args, { db }, info) => {
      return db.arr.find((user) => {
        return user.id === parent.author;
      });
    },
    comments: (parent, args, { db }, info) => {
      return db.comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts: (parent, args, { db }, info) => {
      return db.postArr.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments: (parent, args, { db }, info) => {
      return db.comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author: (parent, args, { db }, info) => {
      return db.comments.find((user) => {
        return user.id === parent.author;
      });
    },
    post: (parent, args, { db }, info) => {
      return db.postArr.find((post) => {
        return post.id === parent.post;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    db: db,
  },
});
server.start(() => console.log("Server is running on localhost:4000"));
