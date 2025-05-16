import { createBrowserRouter, type RouteObject } from 'react-router';

import App from './App';
import AuthLayout from './components/layouts/AuthLayout';
import GuestLayout from './components/layouts/GuestLayout';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Register from './pages/Register';
import RelationshipIndex from './pages/relationships/RelationshipIndex';
import RelationshipOutlet from './pages/relationships/RelationshipOutlet';
import RelationshipView from './pages/relationships/RelationshipView';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/settings/Settings';
import CookiePolicy from './pages/static/CookiePolicy';
import Home from './pages/static/Home';
import NotFound from './pages/static/NotFound';
import Terms from './pages/static/Terms';

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
          },
          { path: '/settings', Component: Settings },
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
