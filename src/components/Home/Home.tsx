import { useState, useEffect, useContext } from 'react';
import FirestoreService, { Group } from '../../services/firestore-service';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import MainContent from './MainContent/MainContent';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { SidebarIcon } from 'lucide-react';
import { UserContext } from '@/App';
import React from 'react';
export const ActiveGroupContext = React.createContext<{ activeGroup: Group | null, setActiveGroup: React.Dispatch<React.SetStateAction<Group | null>> | null }>({ activeGroup: null, setActiveGroup: null });
export const FetchGroupsContext = React.createContext<{ fetchGroups: () => void } | null>(null);
const Home = ({ }) => {

  const user = useContext(UserContext);

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
    if (user) {
      const fetchAndUpdateUserPhotoUrl = async () => {
        const firestoreService = FirestoreService.getInstance();
        const firestoreUser = await firestoreService.getUser(user.uid);
        if (!firestoreUser?.photoUrl && user.photoURL) {
          await firestoreService.updateUserPhotoUrl(user.uid, user.photoURL);
        }
      };
      fetchAndUpdateUserPhotoUrl();
    }
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
    <ActiveGroupContext.Provider value={{ activeGroup, setActiveGroup }}>
      <FetchGroupsContext.Provider value={{ fetchGroups }}>

        < div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-1">
            <div style={{ display: isMobile ? 'block' : 'none' }}>
              <Sheet >
                <SheetTrigger asChild>
                  <Button variant={null} style={{ position: 'absolute', top: '16px', left: '10px', color: 'white' }}><SidebarIcon></SidebarIcon></Button>
                </SheetTrigger>
                <SheetContent className="p-0 pt-8 " side="left">
                  <Sidebar groups={groups} fetchGroups={fetchGroups} />
                </SheetContent>
              </Sheet>
            </div>
            <div style={{ display: isMobile ? 'none' : 'block' }}>
              <div className="w-64">
                <Sidebar groups={groups} fetchGroups={fetchGroups} />
              </div>
            </div>
            <MainContent />
          </div>
        </div>
      </FetchGroupsContext.Provider>

    </ActiveGroupContext.Provider>
  );
}

export default Home;



