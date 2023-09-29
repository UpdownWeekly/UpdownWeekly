import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { User, getAuth, signOut } from 'firebase/auth';

const Header = ({ user }: { user: User }) => {
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
      <div className='flex items-center space-x-4'>
        <h2 className='text-lg font-bold'>{user.displayName}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger> <Avatar>
            <AvatarImage src={user.photoURL || ''} alt="@shadcn" />
            <AvatarFallback style={{color: 'black'}}>{user.displayName ? user.displayName[0].toUpperCase() : ''}</AvatarFallback>
          </Avatar></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;