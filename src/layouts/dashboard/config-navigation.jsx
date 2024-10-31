// import AppsTwoToneIcon from '@mui/icons-material/AppsTwoTone';
// import DiamondTwoToneIcon from '@mui/icons-material/DiamondTwoTone';
// import CategoryTwoToneIcon from '@mui/icons-material/CategoryTwoTone';
// import SlideshowTwoToneIcon from '@mui/icons-material/SlideshowTwoTone';
// import SummarizeTwoToneIcon from '@mui/icons-material/SummarizeTwoTone';
// import LocalMallTwoToneIcon from '@mui/icons-material/LocalMallTwoTone';
// import AssessmentTwoToneIcon from '@mui/icons-material/AssessmentTwoTone';
// import RateReviewTwoToneIcon from '@mui/icons-material/RateReviewTwoTone';
// import BookOnlineTwoToneIcon from '@mui/icons-material/BookOnlineTwoTone';
// import Diversity3TwoToneIcon from '@mui/icons-material/Diversity3TwoTone';
// import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
// import InsertEmoticonTwoToneIcon from '@mui/icons-material/InsertEmoticonTwoTone';
import Face6Icon from '@mui/icons-material/Face6';

// import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  // {
  //   title: 'dashboard',
  //   pageId: 'dashboard',
  //   path: '/',
  //   icon: icon('ic_analytics'),
  //   children: [],
  // },
  {
    title: 'volunteer',
    path: '/volunteer',
    icon: icon('ic_user'),
    children: ['/volunteer', '/volunteer/add'],
  },
  {
    title: 'team-members',
    path: '/team-members',
    icon: icon('ic_group'),
    children: ['/team-members', '/team-members/add'],
  },
  {
    title: 'events',
    path: '/events',
    icon: icon('ic_events'),
    children: ['/events', '/events/add'],
  },
  {
    title: 'users',
    path: '/users',
    icon: <Face6Icon />,
    children: ['/users', '/users/add'],
  },
  {
    title: 'testimonial',
    pageId: 'testimonial',
    path: '/testimonial',
    icon: icon('ic_user'),
    children: ['/testimonial', '/testimonial/add'],
  },
  // {
  //   title: 'brand',
  //   pageId: 'slider',
  //   path: '/brand',
  //   icon: <CategoryTwoToneIcon />,
  //   children: [],
  // },
  // {
  //   title: 'menu',
  //   pageId: 'menu',
  //   path: '/menu',
  //   icon: <SummarizeTwoToneIcon />,
  //   children: ['/menu/category', '/menu/subcategory', '/menu/productType'],
  // },
  // {
  //   title: 'collection',
  //   pageId: 'collection',
  //   path: '/collection',
  //   icon: <AppsTwoToneIcon />,
  //   children: [],
  // },
  // {
  //   title: 'customization',
  //   pageId: 'customization',
  //   path: '/customization',
  //   icon: <AutoAwesomeTwoToneIcon />,
  //   children: ['/customization', '/customization/type', '/customization/subtype'],
  // },
  // {
  //   title: 'showcase banner',
  //   pageId: 'showcasebanner',
  //   path: '/showcase-banner',
  //   icon: <SlideshowTwoToneIcon />,
  //   children: [],
  // },
  // {
  //   title: 'order',
  //   pageId: 'orders',
  //   path: '/orders',
  //   icon: <LocalMallTwoToneIcon />,
  //   children: ['/orders', '/orders/list', '/orders/refund'],
  // },
  // {
  //   title: 'returns',
  //   pageId: 'returns',
  //   path: '/returns',
  //   icon: <Iconify icon="ic:twotone-assignment-return" width={25} />,
  //   children: ['/returns', '/returns/list', '/returns/refund', '/returns/return-detail'],
  // },
  // {
  //   title: 'appointment',
  //   pageId: 'appointments',
  //   path: '/appointment',
  //   icon: <BookOnlineTwoToneIcon />,
  //   children: [],
  // },
  // {
  //   title: 'custom jewelry',
  //   pageId: 'customJewelry',
  //   path: '/custom-jewelry',
  //   icon: <DiamondTwoToneIcon />,
  //   children: [],
  // },
  // {
  //   title: 'review',
  //   pageId: 'review',
  //   path: '/review',
  //   icon: <RateReviewTwoToneIcon />,
  //   children: [],
  // },
  // {
  //   title: 'user',
  //   pageId: 'users',
  //   path: '/user',
  //   icon: <InsertEmoticonTwoToneIcon />,
  //   children: [],
  // },
  // {
  //   title: 'subscribers',
  //   pageId: 'subscribers',
  //   path: '/subscribers',
  //   icon: <Diversity3TwoToneIcon />,
  //   children: [],
  // },
  // {
  //   title: 'permissions',
  //   pageId: 'permissions',
  //   path: '/permissions',
  //   icon: icon('ic_lock'),
  //   children: [],
  // },
  // {
  //   title: 'report & analysis',
  //   pageId: 'report & analysis',
  //   path: '/report-analysis',
  //   icon: <AssessmentTwoToneIcon />,
  //   children: [],
  // },
];

export default navConfig;
