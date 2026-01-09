import { Doc } from 'convex/_generated/dataModel';
import { CourierHomeScreen } from './home';
import { AdminHomeScreen } from './home-admin';
import { UserHomeScreen } from './home-user';

export function HomeScreenByRole({
  user,
}: {
  user: Doc<'users'> & { avatarUrl: string };
}) {
  if (user?.role === 'admin') {
    return <AdminHomeScreen user={user} />;
  } else if (user?.role === 'delivery') {
    return <CourierHomeScreen user={user} />;
  } else {
    return <UserHomeScreen user={user} />;
  }
}
