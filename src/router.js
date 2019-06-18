import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [{
    path: '*',
    redirect: '/index'
  },
  {
    name: 'index',
    path: '/index',
    component: () =>
      import ('./views/index'),
    meta: {
      title: '首页'
    }
  },
  {
    name: 'point',
    path: '/point',
    component: () =>
      import ('./views/point'),
    meta: {
      title: '积分明细'
    }
  },
  {
    name: 'cards',
    path: '/cards',
    component: () =>
      import ('./views/cards'),
    meta: {
      title: '卡券包'
    }
  },
  {
    name: 'records',
    path: '/records',
    component: () =>
      import ('./views/records'),
    meta: {
      title: '消费记录'
    }
  }
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new Router({
  mode: 'history',
  base: '/fwhweb/peacebird',
  routes
});

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export {
  router
};
