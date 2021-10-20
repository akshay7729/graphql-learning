const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0;
      setInterval(() => {
        count++;
        pubsub.publish("count", {
          count,
        });
      }, 1000);
      return pubsub.asyncIterator("count");
    },
  },

  comment: {
    subscribe(parent, args, ctx, info) {
      const { postID } = args;
      const { pubsub, db } = ctx;

      const post = db.postArr.find(
        (post) => post.id === postID && post.published
      );

      if (!post) {
        throw new Error("Post not found");
      }

      return pubsub.asyncIterator(`comment ${postID}`);
    },
  },

  post: {
    subscribe(parent, args, ctx, info) {
      const { pubsub, db } = ctx;

      return pubsub.asyncIterator("post");
    },
  },
};

export { Subscription as default };
