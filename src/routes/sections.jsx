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
export const AddHomePage = lazy(() => import('src/pages/quote/add'));
export const HomePage = lazy(() => import('src/pages/quote/quote'));
export const AddRecognitionPage = lazy(() => import('src/pages/recognition/add'));
export const RecognitionPage = lazy(() => import('src/pages/recognition/recognition'));
export const AddGalleryPage = lazy(() => import('src/pages/gallery/add'));
export const GalleryPage = lazy(() => import('src/pages/gallery/gallery'));
export const AddBlogPage = lazy(() => import('src/pages/blog/add'));
export const BlogPage = lazy(() => import('src/pages/blog/blog'));

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
        // {
        //   path: '/brand',
        //   element: (
        //     <ProtectedRoutes pageId={'slider'}>
        //       <SliderViewAddPage />
        //     </ProtectedRoutes>
        //   ),
        // },
        // {
        //   path: '/menu',
        //   element: (
        //     <ProtectedRoutes pageId={'menu'}>
        //       <MenuPage />
        //     </ProtectedRoutes>
        //   ),
        //   children: [
        //     {
        //       path: '/menu/category',
        //       element: (
        //         <ProtectedRoutes pageId={'menu'}>
        //           <MenuPage />
        //         </ProtectedRoutes>
        //       ),
        //     },
        //     {
        //       path: '/menu/subcategory',
        //       element: (
        //         <ProtectedRoutes pageId={'menu'}>
        //           <MenuPage />
        //         </ProtectedRoutes>
        //       ),
        //     },
        //     {
        //       path: '/menu/productType',
        //       element: (
        //         <ProtectedRoutes pageId={'menu'}>
        //           <MenuPage />
        //         </ProtectedRoutes>
        //       ),
        //     },
        //   ],
        // },
        // {
        //   path: '/collection',
        //   element: (
        //     <ProtectedRoutes pageId={'collection'}>
        //       <Collection />
        //     </ProtectedRoutes>
        //   ),
        // },
        // {
        //   path: '/customization',
        //   element: (
        //     <ProtectedRoutes pageId={'customization'}>
        //       <Customization />
        //     </ProtectedRoutes>
        //   ),
        //   children: [
        //     {
        //       path: '/customization/type',
        //       element: (
        //         <ProtectedRoutes pageId={'customization'}>
        //           <Customization />
        //         </ProtectedRoutes>
        //       ),
        //     },
        //     {
        //       path: '/customization/subtype',
        //       element: (
        //         <ProtectedRoutes pageId={'customization'}>
        //           <Customization />
        //         </ProtectedRoutes>
        //       ),
        //     },
        //   ],
        // },
        // {
        //   path: '/showcase-banner',
        //   element: (
        //     <ProtectedRoutes pageId={'showcasebanner'}>
        //       <ShowCaseBanner />
        //     </ProtectedRoutes>
        //   ),
        // },
        // {
        //   path: '/appointment',
        //   element: (
        //     <ProtectedRoutes pageId={'appointments'}>
        //       <Appointments />
        //     </ProtectedRoutes>
        //   ),
        // },
        // {
        //   path: '/custom-jewelry',
        //   element: (
        //     <ProtectedRoutes pageId={'customJewelry'}>
        //       <CustomJewelry />
        //     </ProtectedRoutes>
        //   ),
        // },
        // {
        //   path: '/review',
        //   element: (
        //     <ProtectedRoutes pageId={'review'}>
        //       <Review />
        //     </ProtectedRoutes>
        //   ),
        // },
        // {
        //   path: 'user',
        //   element: (
        //     <ProtectedRoutes pageId={'users'}>
        //       <UserPage />
        //     </ProtectedRoutes>
        //   ),
        // },
        // {
        //   path: 'subscribers',
        //   element: (
        //     <ProtectedRoutes pageId={'subscribers'}>
        //       <Subscribers />
        //     </ProtectedRoutes>
        //   ),
        // },
        // {
        //   path: 'permissions',
        //   element: (
        //     <ProtectedRoutes pageId={'permissions'}>
        //       <Permissions />
        //     </ProtectedRoutes>
        //   ),
        // },
        // {
        //   path: 'orders',
        //   element: (
        //     <ProtectedRoutes pageId={'orders'}>
        //       <Orders />
        //     </ProtectedRoutes>
        //   ),
        //   children: [
        //     {
        //       path: '/orders/list',
        //       element: (
        //         <ProtectedRoutes pageId={'orders'}>
        //           <OrderList />
        //         </ProtectedRoutes>
        //       ),
        //     },
        //     {
        //       path: '/orders/refund',
        //       element: (
        //         <ProtectedRoutes pageId={'orders'}>
        //           <Refund />
        //         </ProtectedRoutes>
        //       ),
        //     },
        //   ],
        // },
        // {
        //   path: '/orders/order-detail/:orderId',
        //   element: (
        //     <ProtectedRoutes pageId={'orders'}>
        //       <OrdersDetail />
        //     </ProtectedRoutes>
        //   ),
        // },
        // {
        //   path: 'returns',
        //   element: (
        //     <ProtectedRoutes pageId={'returns'}>
        //       <Returns />
        //     </ProtectedRoutes>
        //   ),
        //   children: [
        //     {
        //       path: '/returns/list',
        //       element: (
        //         <ProtectedRoutes pageId={'returns'}>
        //           <ReturnList />
        //         </ProtectedRoutes>
        //       ),
        //     },
        //     {
        //       path: '/returns/refund',
        //       element: (
        //         <ProtectedRoutes pageId={'returns'}>
        //           <ReturnRefund />
        //         </ProtectedRoutes>
        //       ),
        //     },
        //   ],
        // },
        // {
        //   path: '/returns/return-detail/:returnId',
        //   element: (
        //     <ProtectedRoutes pageId={'returns'}>
        //       <ReturnDetail />
        //     </ProtectedRoutes>
        //   ),
        // },
        // {
        //   path: '/report-analysis',
        //   element: (
        //     <ProtectedRoutes pageId={'report & analysis'}>
        //       <ReportAnalysis />
        //     </ProtectedRoutes>
        //   ),
        // },
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
