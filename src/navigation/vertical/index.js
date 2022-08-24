export default [
  {
    header: 'Dashboard',
  },
  {
    title: 'Usage Statistics',
    route: 'home',
    icon: 'PieChartIcon',
  },
  {
    header: 'Manage Organisations',
  },
  {
    title: 'Organisations',
    route: 'organisations-list',
    icon: 'UmbrellaIcon',
  },
  {
    header: 'Bulk Account',
  },
  {
    title: 'My Bulk Account',
    route: 'bulk-accounts',
    icon: 'MessageSquareIcon',
  },
  {
    header: 'Sender IDs',
  },
  {
    title: 'My Sender IDs',
    route: 'senders-list',
    icon: 'HashIcon',
  },
  {
    header: 'Manage Accounts',
  },
  {
    title: 'Staff Accounts',
    route: 'staff-accounts',
    icon: 'UsersIcon',
  },
  {
    header: 'Message Outbox',
  },
  {
    title: 'Outbox',
    icon: 'LogOutIcon',
    children: [
      {
        title: 'Bulk Outbox',
        route: 'outbox',
      },
      {
        title: 'API Outbox',
        route: { name: 'api-outbox' },
      },
    ],
  },
]
