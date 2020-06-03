import $p1 from '../pages/home';

import $p2 from '../pages/minha-conta';
import $p3 from '../pages/dados-pessoais';
import $p4 from '../pages/dados-pessoais/input';
import $p5 from '../pages/dados-complementares';
import $p6 from '../pages/dados-complementares/input';
import $p7 from '../pages/minhas-mascaras';
import $p8 from '../pages/nova-mascara';
//import $p9 from '../pages/conta-bancaria';
//import $p10 from '../pages/conta-bancaria/input';
import $p11 from '../pages/formas-de-pagamento';
import $p12 from '../pages/minhas-compras';
import $p13 from '../pages/taxas-e-cobrancas';
import $p14 from '../pages/minhas-vendas';
import $p15 from '../pages/editar-mascara';

import $pMascara from '../pages/mascara';

//import $pChat from '../pages/chat';

import $pSignUp from '../pages/sign-up-screen';
import $pLogin from '../pages/login-screen';
import $pActivateAccount from '../pages/activate-account';
import $p404 from '../pages/404';

function checkAuth(to, from, resolve, reject) {
  const route = this;
  if (!app.data.session_token) {
    reject(); route.navigate('/login');
  } else resolve();
}

//function checkPermission(to, from, resolve, reject) {
//  if (app.data.permission) {
//    resolve();
//  } else {
//    reject();
//  }
//}

var routes = [
  { path: '/', redirect: '/home' },
  { component: $p1, path: '/home', beforeEnter: [checkAuth] },
  { component: $p2, path: '/minha-conta', beforeEnter: [checkAuth] },
  { component: $p3, path: '/dados-pessoais', beforeEnter: [checkAuth] },
  { component: $p4, path: '/dados-pessoais/input/:index', beforeEnter: [checkAuth] },
  { component: $p5, path: '/dados-complementares', beforeEnter: [checkAuth] },
  { component: $p6, path: '/dados-complementares/input/:index', beforeEnter: [checkAuth] },
  { component: $p7, path: '/minhas-mascaras', beforeEnter: [checkAuth] },
  { component: $p8, path: '/nova-mascara', beforeEnter: [checkAuth] },
  //{ component: $p9, path: '/conta-bancaria', beforeEnter: [checkAuth] },
  //{ component: $p10, path: '/conta-bancaria/input/:index', beforeEnter: [checkAuth] },
  { component: $p11, path: '/formas-de-pagamento', beforeEnter: [checkAuth] },
  { component: $p12, path: '/minhas-compras', beforeEnter: [checkAuth] },
  { component: $p13, path: '/taxas-e-cobrancas', beforeEnter: [checkAuth] },
  { component: $p14, path: '/minhas-vendas', beforeEnter: [checkAuth] },
  { component: $p15, path: '/editar-mascara', beforeEnter: [checkAuth] },
  { component: $pMascara, path: '/mascara', beforeEnter: [checkAuth] },
  //{ component: $pChat, path: '/chat/:compraID', beforeEnter: [checkAuth] },
  { component: $pLogin, path: '/login' },
  { component: $pSignUp, path: '/sign-up' },
  { component: $pActivateAccount, path: '/activate-account' },
  { component: $p404, path: '(.*)' },
];

export default routes;

//{
//  path: '/request-and-load/user/:userId/',
//  async: function (routeTo, routeFrom, resolve, reject) {
//    // Router instance
//    var router = this;
//
//    // App instance
//    var app = router.app;
//
//    // Show Preloader
//    app.preloader.show();
//
//    // User ID from request
//    var userId = routeTo.params.userId;
//
//    // Simulate Ajax Request
//    setTimeout(function () {
//      // We got user data from request
//      var user = {
//        firstName: 'Vladimir',
//        lastName: 'Kharlampidi',
//        about: 'Hello, i am creator of Framework7! Hope you like it!',
//        links: [
//          {
//            title: 'Framework7 Website',
//            url: 'http://framework7.io',
//          },
//          {
//            title: 'Framework7 Forum',
//            url: 'http://forum.framework7.io',
//          },
//        ]
//      };
//      // Hide Preloader
//      app.preloader.hide();
//
//      // Resolve route to load page
//      resolve(
//        {
//          component: RequestAndLoad,
//        },
//        {
//          context: {
//            user: user,
//          }
//        }
//      );
//    }, 1000);
//  },
//},
