import Vue from 'vue'
import VueRouter from 'vue-router'
import { canNavigate } from '@/libs/acl/routeProtection'
import { isUserLoggedIn, getUserData, getHomeRouteForLoggedInUser } from '@/auth/utils'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/dashboard/Home.vue'),
    },
    {
      path: '/organisations/list',
      name: 'organisations-list',
      component: () => import('@/views/organisations/organisations-list/OrganisationList.vue'),
      meta: {
        pageTitle: 'Organisations',
        breadcrumb: [
          {
            text: 'Organisations',
            to: { name: 'organisations-list' },
          },
          {
            text: 'Organisation List',
            active: true,
          },
        ],
      },
    },
    {
      path: '/organisations/view/:id',
      name: 'organisations-view',
      component: () => import('@/views/organisations/organisations-view/OrganisationsView.vue'),
      meta: {
        pageTitle: 'Organisations',
        breadcrumb: [
          {
            text: 'Organisations',
            to: { name: 'organisations-list' },
          },
          {
            text: 'Organisation Details',
            active: true,
          },
        ],
      },
    },
    {
      path: '/organisations/edit/:id',
      name: 'organisations-edit',
      component: () => import('@/views/organisations/organisations-edit/OrganisationEdit.vue'),
      meta: {
        pageTitle: 'Organisations',
        breadcrumb: [
          {
            text: 'Organisations',
            to: { name: 'organisations-list' },
          },
          {
            text: 'Organisation Edit',
            active: true,
          },
        ],
      },
    },
    {
      path: '/staff-accounts',
      name: 'staff-accounts',
      component: () => import('@/views/users/users-list/UsersList.vue'),
      meta: {
        pageTitle: 'Staff Accounts',
        breadcrumb: [
          {
            text: 'Accounts',
            to: { name: 'staff-accounts' },
          },
          {
            text: 'Account List',
            active: true,
          },
        ],
      },
    },
    {
      path: '/staff-accounts/view/:id',
      name: 'staff-accounts-view',
      component: () => import('@/views/users/users-view/UsersView.vue'),
      meta: {
        pageTitle: 'Staff Accounts',
        breadcrumb: [
          {
            text: 'Accounts',
            to: { name: 'staff-accounts' },
          },
          {
            text: 'View Account',
            active: true,
          },
        ],
      },
    },
    {
      path: '/staff-accounts/edit/:id',
      name: 'staff-accounts-edit',
      component: () => import('@/views/users/users-edit/UsersEdit.vue'),
      meta: {
        pageTitle: 'Staff Accounts',
        breadcrumb: [
          {
            text: 'Accounts',
            to: { name: 'staff-accounts' },
          },
          {
            text: 'Edit Account',
            active: true,
          },
        ],
      },
    },
    {
      path: '/outbox',
      name: 'outbox',
      component: () => import('@/views/outbox/outbox-list/OutboxList.vue'),
    },
    {
      path: '/api-outbox',
      name: 'api-outbox',
      component: () => import('@/views/outbox/outbox-list/ApiOutboxList.vue'),
    },
    {
      path: '/organisations/add-new',
      name: 'organisations-add-new',
      component: () => import('@/views/organisations/AddNew.vue'),
      meta: {
        pageTitle: 'Organisations',
        breadcrumb: [
          {
            text: 'Organisations',
            to: { name: 'organisations-list' },
          },
          {
            text: 'Add New Organisation',
            active: true,
          },
        ],
      },
    },
    // {
    //   path: '/organisations/edit/:id',
    //   name: 'organisations-edit',
    //   component: () => import('@/views/apps/user/organisations-edit/OrganisationsEdit.vue'),
    // },
    {
      path: '/senders',
      name: 'senders-list',
      component: () => import('@/views/senders/senders-list/SendersList.vue'),
      meta: {
        pageTitle: 'Senders',
        breadcrumb: [
          {
            text: 'Senders',
            to: { name: 'senders-list' },
          },
          {
            text: 'Sender List',
            active: true,
          },
        ],
      },
    },
    {
      path: '/bulk-accounts',
      name: 'bulk-accounts',
      component: () => import('@/views/bulk-accounts/BulkAccount.vue'),
      meta: {
        pageTitle: 'My Bulk Account',
        breadcrumb: [
          {
            text: 'Account Details',
            active: true,
          },
        ],
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
    {
      path: '/login',
      name: 'auth-login',
      component: () => import('@/views/authentication/Login.vue'),
      meta: {
        layout: 'full',
        resource: 'Auth',
        redirectIfLoggedIn: true,
      },
    },
    {
      path: '/register',
      name: 'auth-register',
      component: () => import('@/views/authentication/Register.vue'),
      meta: {
        layout: 'full',
        resource: 'Auth',
        redirectIfLoggedIn: true,
      },
    },
    {
      path: '/forgot-password',
      name: 'auth-forgot-password',
      component: () => import('@/views/authentication/ForgotPassword.vue'),
      meta: {
        layout: 'full',
        resource: 'Auth',
        redirectIfLoggedIn: true,
      },
    },
    {
      path: '/pages/authentication/reset-password-v1',
      name: 'auth-reset-password-v1',
      component: () => import('@/views/authentication/ResetPassword-v1.vue'),
      meta: {
        layout: 'full',
      },
    },
  ],
})
// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn()

  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    if (!isLoggedIn) return next({ name: 'auth-login' })

    // If logged in => not authorized
    return next({ name: 'misc-not-authorized' })
  }

  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    const userData = getUserData()
    next(getHomeRouteForLoggedInUser(userData ? userData.role : null))
  }

  return next()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
