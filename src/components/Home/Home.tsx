import { useState } from 'react';
import { User } from 'firebase/auth';
import  { Group } from '../../services/firestore-service';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import MainContent from './MainContent/MainContent';



const Home = ({ user }: { user: User }) => {

  const [activeGroup, setActiveGroup] = useState<Group | null>(null);

  return (
    <div>
      <div className="flex flex-col h-screen">
        <Header user={user} />
        <div className="flex flex-1">
          <Sidebar user={user} activeGroup={activeGroup} setActiveGroup={setActiveGroup} />
          <MainContent activeGroup={activeGroup} user={user} />
        </div>
      </div>
    </div>
  );
}

export default Home;


