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

const db = {
  arr,
  postArr,
  comments,
};

export { db as default };
