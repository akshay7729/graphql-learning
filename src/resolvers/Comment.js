const Comment = {
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
};

export { Comment as default };
