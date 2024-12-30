// app/account/page.js
import { UserProfile } from '@clerk/nextjs';

export default function AccountPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <UserProfile />
    </div>
  );
}
