const Query = {
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
};

export { Query as default };
