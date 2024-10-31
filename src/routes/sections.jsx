import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
// import ProtectedRoutes from 'src/guard/ProtectedRoutes';

export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const Unauthorized = lazy(() => import('src/pages/unauthorized'));
export const AddVolunteerPage = lazy(() => import('src/pages/volunteer/add'));
export const AddTeamMembersPage = lazy(() => import('src/pages/team-members/add'));
export const VolunteersPage = lazy(() => import('src/pages/volunteer/volunteer'));
export const ForgetPassword = lazy(() => import('src/pages/forget-password'));
export const TeamMembersPage = lazy(() => import('src/pages/team-members/team-members'));
export const EventsPage = lazy(() => import('src/pages/events/events'));
export const AddEventsPage = lazy(() => import('src/pages/events/add'));
export const UserPage = lazy(() => import('src/pages/users/users'));
export const AddUserPage = lazy(() => import('src/pages/users/add'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: (
            // <ProtectedRoutes pageId={'dashboard'}>
            <div>DashBoard</div>
            // </ProtectedRoutes>
          ),
          index: true,
        },

        {
          path: 'volunteer',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <VolunteersPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: '/volunteer/add',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <AddVolunteerPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: '/team-members',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <TeamMembersPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: '/team-members/add',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <AddTeamMembersPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: '/events',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <EventsPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: '/events/add',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <AddEventsPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: '/users',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <UserPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: '/users/add',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <AddUserPage />
            // </ProtectedRoutes>
          ),
        },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'forget-password',
      element: <ForgetPassword />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: 'unauthorized',
      element: <Unauthorized />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
