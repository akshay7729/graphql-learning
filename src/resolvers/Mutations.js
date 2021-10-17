import { v4 as uuidv4 } from "uuid";
const Mutation = {
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

  updateUser(parent, args, { db }, info) {
    const user = db.arr.find((user) => user.id === args.id);
    if (!user) {
      throw new Error("User not found");
    }

    if (typeof args.data.email === "string") {
      const emailTaken = db.arr.some((user) => user.email === args.data.email);

      if (emailTaken) {
        throw new Error("Email taken");
      }

      user.email = args.data.email;
    }

    if (typeof args.data.name === "string") {
      user.name = args.data.name;
    }

    if (typeof args.data.age !== "undefined") {
      user.age = args.data.age;
    }

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
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
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

  updatePost(parent, args, { db }, info) {
    const { id, data } = args;

    const post = db.postArr.find((post) => post.id === id);
    if (!post) {
      throw new Error("Post not found");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;
    }

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
};

export { Mutation as default };
