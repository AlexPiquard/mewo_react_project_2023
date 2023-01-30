const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const discussionRoute = require('./discussion.route');
const commentRoute = require('./comment.route');
const docsRoute = require('./docs.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/discussions',
    route: discussionRoute,
  },
  {
    path: '/comments',
    route: commentRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
