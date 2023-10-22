import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import FirestoreService, { Week } from '../../../services/firestore-service';
import { useState, useEffect, useContext } from 'react';
import WeekComponent from './Week/Week';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import React from 'react';
import { UserContext } from '@/App';
import GroupHeader from './GroupHeader/GroupHeader';
import { ActiveGroupContext } from '../Home';

const firestoreService = FirestoreService.getInstance();

const MainContent = () => {

  const [weeks, setWeeks] = useState<Week[]>();
  const [hasEntryThisWeek, setHasEntryThisWeek] = useState(false);
  const [highlight, setHighlight] = useState('');
  const [lowlight, setLowlight] = useState('');
  const [refreshContent, setRefreshContent] = useState(false);

  const user = useContext(UserContext);
  const { activeGroup } = useContext(ActiveGroupContext);

  const handleSend = async () => {
    if (activeGroup && user) {
      await firestoreService.createEntry(activeGroup.id, user.uid, highlight, lowlight);
      setHighlight('');
      setLowlight('');
      setRefreshContent(prevState => !prevState); // Add this line
    }
  };

  const fetchHasEntryThisWeek = async () => {
    if (activeGroup && user) {
      try {
        const hasEntry = await firestoreService.userMadeEntryThisWeek(activeGroup.id, user.uid);
        setHasEntryThisWeek(hasEntry);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchHasEntryThisWeek();
  }, [activeGroup, user, refreshContent]);

  useEffect(() => {
    if (activeGroup) {
      firestoreService.getWeeks(activeGroup.id)
        .then((weeks) => {
          weeks.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()); console.log("Weeks: ", weeks);
          setWeeks(weeks);
        })
        .catch((error) => console.error(error));
    }
  }, [activeGroup, refreshContent]);

  return (
    <Card className='w-full max-w-[800px] p-0 space-y-4 border-t-0 rounded-t-none'>
      <CardHeader className='flex justify-center w-full'>
        <GroupHeader></GroupHeader>
      </CardHeader>
      <CardContent className='space-y-4 p-0'>
        {activeGroup && !hasEntryThisWeek && (
          <Card className='m-4 border-4' style={{background: 'linear-gradient(to bottom right, #E4F7F6, #AFD5DB)'}}>
            <CardHeader className='mt-4 mb-4'>
              <CardTitle>Share what happened <b>last</b> week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col md:flex-row justify-between'>
                <div className='w-full md:w-1/2 mr-2'>
                  <h3 className='font-bold mb-2'>Highlight</h3>
                  <Textarea id='highlight-input' placeholder='Type your highlight...' value={highlight} onChange={(e) => setHighlight(e.target.value)} />
                </div>
                <div className='w-full mt-2 md:mt-0 md:w-1/2 md:ml-2'>
                  <h3 className='font-bold mb-2'>Lowlight</h3>
                  <Textarea id='lowlight-input' placeholder='Type your lowlight...' value={lowlight} onChange={(e) => setLowlight(e.target.value)} />
                </div>
              </div>
              <div className='flex justify-end mt-4 w-full'>
                <Button variant={'ghost'} className='p-2 hover:bg-transparent' onClick={handleSend}><Send></Send></Button>
              </div>
            </CardContent>
          </Card>
        )}

        {weeks?.map((week) => (
          <React.Fragment key={week.id}>
            <WeekComponent groupId={activeGroup?.id!} week={week} fetchHasEntryThisWeek={fetchHasEntryThisWeek} refreshContent={refreshContent} />
          </React.Fragment>
        ))}
      </CardContent>

    </Card>
  );
}

export default MainContent;
