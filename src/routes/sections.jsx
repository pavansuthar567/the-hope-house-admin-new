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
export const AddTestimonialPage = lazy(() => import('src/pages/testimonial/add'));
export const TestimonialPage = lazy(() => import('src/pages/testimonial/testimonial'));
export const ForgetPassword = lazy(() => import('src/pages/forget-password'));
export const TeamMembersPage = lazy(() => import('src/pages/team-members/team-members'));
export const EventsPage = lazy(() => import('src/pages/events/events'));
export const AddEventsPage = lazy(() => import('src/pages/events/add'));
export const UserPage = lazy(() => import('src/pages/users/users'));
export const AddUserPage = lazy(() => import('src/pages/users/add'));
export const AddFaqsPage = lazy(() => import('src/pages/faqs/add'));
export const FaqsPage = lazy(() => import('src/pages/faqs/faqs'));
export const AddQuotePage = lazy(() => import('src/pages/quote/add'));
export const QuotePage = lazy(() => import('src/pages/quote/quote'));
export const AddHomePage = lazy(() => import('src/pages/home/add'));
export const HomePage = lazy(() => import('src/pages/home/home'));
export const AddRecognitionPage = lazy(() => import('src/pages/recognition/add'));
export const RecognitionPage = lazy(() => import('src/pages/recognition/recognition'));
export const AddGalleryPage = lazy(() => import('src/pages/gallery/add'));
export const GalleryPage = lazy(() => import('src/pages/gallery/gallery'));
export const AddBlogPage = lazy(() => import('src/pages/blog/add'));
export const BlogPage = lazy(() => import('src/pages/blog/blog'));
export const MessagePage = lazy(() => import('src/pages/message/message'));

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
        {
          path: 'testimonial',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <TestimonialPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: '/testimonial/add',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <AddTestimonialPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: 'faqs',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <FaqsPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: '/faqs/add',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <AddFaqsPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: 'quote',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <QuotePage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: '/quote/add',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <AddQuotePage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: 'home',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <HomePage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: '/home/add',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <AddHomePage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: 'recognition',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <RecognitionPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: '/recognition/add',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <AddRecognitionPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: 'message',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <MessagePage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: 'gallery',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <GalleryPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: '/gallery/add',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <AddGalleryPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: 'blog',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <BlogPage />
            // </ProtectedRoutes>
          ),
        },
        {
          path: '/blog/add',
          element: (
            // <ProtectedRoutes pageId={'volunteer'}>
            <AddBlogPage />
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
