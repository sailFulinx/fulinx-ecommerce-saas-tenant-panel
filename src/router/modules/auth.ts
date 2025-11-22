const auth: AppRouteRecordRaw = {
  path: '/auth',
  name: 'Auth',
  redirect: '/auth/login',
  meta: {
    hidden: true,
    title: '注册',
    noTagsView: true,
  },
  children: [
    {
      path: 'login',
      name: 'Login',
      component: () => import('@/views/Auth/Login.vue'),
      meta: {
        hidden: true,
        title: '登录',
        noTagsView: true,
      },
    },
    {
      path: 'register',
      name: 'Register',
      component: () => import('@/views/Auth/Register.vue'),
      meta: {
        hidden: true,
        title: '注册',
        noTagsView: true,
      },
    },
    {
      path: 'register/confirm',
      name: 'RegisterConfirm',
      component: () => import('@/views/Auth/RegisterConfirm.vue'),
      meta: {
        hidden: true,
        title: '注册确认',
        noTagsView: true,
      },
    },
    {
      path: 'forget-password',
      name: 'ForgetPassword',
      component: () => import('@/views/Auth/ForgetPassword.vue'),
      meta: {
        hidden: true,
        title: '忘记密码',
        noTagsView: true,
      },
    },
  ],
}

export default auth
