import { createBrowserRouter, RouteObject } from 'react-router';
import Dashboard from './pages/Dashboard';
import Home from './pages/static/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthLayout from './components/layouts/AuthLayout.tsx';
import RelationshipOutlet from './pages/relationships/RelationshipOutlet.tsx';
import RelationshipIndex from './pages/relationships/RelationshipIndex.tsx';
import RelationshipView from './pages/relationships/RelationshipView.tsx';
import GuestLayout from './components/layouts/GuestLayout.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
import CookiePolicy from './pages/static/CookiePolicy.tsx';
import Terms from './pages/static/Terms.tsx';
import NotFound from './pages/static/NotFound.tsx';
import App from './App.tsx';

const routes: RouteObject[] = [
  {
    Component: App,
    children: [
      { path: '/', Component: Home },
      {
        Component: AuthLayout,
        children: [
          { path: '/dashboard', Component: Dashboard },
          {
            path: '/relationships',
            Component: RelationshipOutlet,
            children: [
              { index: true, Component: RelationshipIndex },
              { path: ':id', Component: RelationshipView }
            ]
          }
        ]
      },
      {
        Component: GuestLayout,
        children: [
          { path: '/login', Component: Login },
          { path: '/register', Component: Register },
          { path: '/forgot-password', Component: ForgotPassword },
          { path: '/password-reset/:token', Component: ResetPassword },
          { path: '/cookie-policy', Component: CookiePolicy },
          { path: '/terms', Component: Terms }
        ]
      },
    ]
  },
  { path: '*', Component: NotFound }
];

const router = createBrowserRouter(routes);

export { routes, router };