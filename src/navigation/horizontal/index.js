export default [
  {
    title: 'Home',
    route: 'home',
    icon: 'HomeIcon',
  },
  {
    title: 'Organisations',
    route: 'organisations-list',
    icon: 'UmbrellaIcon',
  },
  {
    title: 'My Bulk Account',
    route: 'bulk-accounts',
    icon: 'MessageSquareIcon',
  },
  {
    title: 'My Sender IDs',
    route: 'senders-list',
    icon: 'HashIcon',
  },
  {
    title: 'User Accounts',
    route: 'staff-accounts',
    icon: 'UsersIcon',
  },
  {
    header: 'Message Outbox',
    title: 'Outbox',
    icon: 'LogOutIcon',
    children: [
      {
        title: 'Bulk Outbox',
        route: 'outbox',
      },
      {
        title: 'API Outbox',
        route: { name: 'misc-coming-soon' },
      },
    ],
  },
]
