import { getFourAvatars } from '@/app/actions/getFourAvatars';
import { FloatingCard } from './FloatingCard';

export async function HomeAvatars() {
  const users = await getFourAvatars();

  if (!users) {
    throw new Error('failed to fetch users');
  }

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {users.map((user) => (
        <FloatingCard key={user.id} user={user} />
      ))}
    </div>
  );
}
