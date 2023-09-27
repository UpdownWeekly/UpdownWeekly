import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import  { Group } from '../../services/firestore-service';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import MainContent from './MainContent/MainContent';
import {   Sheet,
  SheetContent,
  SheetTrigger, } from '../ui/sheet';
import { Button } from '../ui/button';
import { SidebarIcon } from 'lucide-react';

const Home = ({ user }: { user: User }) => {

  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header user={user} />
      <div className="flex flex-1">
        {isMobile ? (
          <Sheet >
            <SheetTrigger asChild>
              <Button variant={null} style={{ position: 'absolute', top: '16px', left: '10px', color: 'white' }}><SidebarIcon></SidebarIcon></Button>
            </SheetTrigger>
            <SheetContent className="p-0 pt-8 " side="left">
              <Sidebar user={user} activeGroup={activeGroup} setActiveGroup={setActiveGroup} />
            </SheetContent>
          </Sheet>
        ) : (
          <div className="w-64">
            <Sidebar user={user} activeGroup={activeGroup} setActiveGroup={setActiveGroup} />
          </div>
        )}
        <MainContent activeGroup={activeGroup} user={user} />
      </div>
    </div>
  );
}

export default Home;



