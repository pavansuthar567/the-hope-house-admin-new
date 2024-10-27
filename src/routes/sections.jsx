import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
// import ProtectedRoutes from 'src/guard/ProtectedRoutes';

export const IndexPage = lazy(() => import('src/pages/app'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const Unauthorized = lazy(() => import('src/pages/unauthorized'));
export const AddVolunteerPage = lazy(() => import('src/pages/volunteer/add'));
export const VolunteersPage = lazy(() => import('src/pages/volunteer/volunteer'));
export const ForgetPassword = lazy(() => import('src/pages/forget-password'));

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
            <IndexPage />
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
