export default [
  {
    path: '/',
    props: true,
    component: () => import(/* webpackChunkName: "todo-view" */ '../views/todo/todo.vue'),
    name: 'app',
    meta: {
      title: 'this is app',
      description: 'asdasd'
    }
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login-view" */ '../views/login/login.vue')
  }

]
