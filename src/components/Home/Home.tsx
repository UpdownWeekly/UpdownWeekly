import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import  FirestoreService, { Group } from '../../services/firestore-service';
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
  const [groups, setGroups] = useState<Group[]>([]);

  const fetchGroups = async () => {
      if (user != null) {
          const firestoreService = FirestoreService.getInstance();
          const groups = await firestoreService.getGroups(user.uid);
          setGroups(groups)
      }
  }
  useEffect(() => {
      fetchGroups();

  }, [user]);

  useEffect(() => {

    const storedActiveGroup = localStorage.getItem('activeGroup');
    if (storedActiveGroup) {
        setActiveGroup(JSON.parse(storedActiveGroup));
    }
}, [user]);

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
        <div style={{ display: isMobile ? 'block' : 'none' }}>
          <Sheet >
            <SheetTrigger asChild>
              <Button variant={null} style={{ position: 'absolute', top: '16px', left: '10px', color: 'white' }}><SidebarIcon></SidebarIcon></Button>
            </SheetTrigger>
            <SheetContent className="p-0 pt-8 " side="left">
              <Sidebar user={user} groups={groups} fetchGroups={fetchGroups} activeGroup={activeGroup} setActiveGroup={setActiveGroup} />
            </SheetContent>
          </Sheet>
        </div>
        <div style={{ display: isMobile ? 'none' : 'block' }}>
          <div className="w-64">
            <Sidebar user={user} groups={groups} fetchGroups={fetchGroups} activeGroup={activeGroup} setActiveGroup={setActiveGroup} />
          </div>
        </div>
        <MainContent activeGroup={activeGroup} user={user} />
      </div>
    </div>
  );
}

export default Home;



