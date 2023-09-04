import { Button } from '@/components/ui/button';
import { getAuth, signOut } from 'firebase/auth';

const Header = () => {
  function handleLogout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('User signed out');
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  }

  return (
    <header className="bg-blue-500 p-4 text-white flex justify-end">
      <div className="flex">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </header>
  );
};

export default Header;