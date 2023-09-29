import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import FirestoreService, { Group } from '../../../services/firestore-service';
import { useState, useEffect } from 'react';
import Week from './Week/Week';
import { Textarea } from '@/components/ui/textarea';
import { User } from 'firebase/auth';
import { Send } from 'lucide-react';

const firestoreService = FirestoreService.getInstance();

const MainContent = ({ activeGroup, user }: { activeGroup: Group | null, user: User }) => {

  const [weeks, setWeeks] = useState<string[] | null>(null);
  const [hasEntryThisWeek, setHasEntryThisWeek] = useState(false);
  const [highlight, setHighlight] = useState('');
  const [lowlight, setLowlight] = useState('');
  const [refreshContent, setRefreshContent] = useState(false);


  const handleSend = async () => {
    if (activeGroup && user) {
      await firestoreService.createEntry(activeGroup.id, user.uid, highlight, lowlight);
      setHighlight('');
      setLowlight('');
      setRefreshContent(prevState => !prevState); // Add this line
    }
  };

  const fetchHasEntryThisWeek = async () => {
    if (activeGroup) {
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
        .then((weeks) => setWeeks(weeks))
        .catch((error) => console.error(error));
    }
  }, [activeGroup, refreshContent]);



  return (
    <div className='content w-full p-4 space-y-4'>
      <div className='content-container space-y-8'>
        <div className='flex justify-center w-full'>
          {activeGroup ? <h1 className='text-2xl font-bold'>{activeGroup.name}</h1> : <h1 className='text-2xl font-bold'>No Group Selected</h1>}
        </div>
        {activeGroup && !hasEntryThisWeek && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">New Entry</CardTitle>
              <CardDescription className="text-center">Share what happened last week.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col md:flex-row justify-between'>
                <div className='w-full md:w-1/2 m-2'>
                  <h3 className='text-center font-bold mb-2'>Highlight</h3>
                  <Textarea id='highlight-input' placeholder='Type your highlight...' value={highlight} onChange={(e) => setHighlight(e.target.value)} />
                </div>
                <div className='w-full md:w-1/2 m-2'>
                  <h3 className='text-center font-bold mb-2'>Lowlight</h3>
                  <Textarea id='lowlight-input' placeholder='Type your lowlight...' value={lowlight} onChange={(e) => setLowlight(e.target.value)} />
                </div>
              </div>
              <div className='flex justify-end mt-4 w-full'>
                <Button id='send-button' variant={'ghost'} onClick={handleSend}><Send/></Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {weeks?.map((weekId) => (
        <Week key={weekId} groupId={activeGroup?.id!} weekId={weekId} user={user} fetchHasEntryThisWeek={fetchHasEntryThisWeek} refreshContent={refreshContent}/>      ))}
    </div>
  );
}

export default MainContent;
