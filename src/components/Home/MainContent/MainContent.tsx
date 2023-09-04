import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import FirestoreService, { Group, Entry } from '../../../services/firestore-service';
import { useState, useEffect } from 'react';
import Week from './Week/Week';

const firestoreService = FirestoreService.getInstance();

const MainContent = ({ activeGroup }: { activeGroup: Group | null }) => {

  const [weeks, setWeeks] = useState<string[] | null>(null);

  useEffect(() => {
    if (activeGroup) {
      firestoreService.getWeeks(activeGroup.id)
        .then((weeks) => setWeeks(weeks))
        .catch((error) => console.error(error));
    }
  }, [activeGroup]);

  return (
    <div className='content w-full p-4'>
      <div className='content-container'>
        <div className='content-posts'></div>
          <div className='flex justify-center w-full'>
            <h1 className='text-2xl font-bold'>{activeGroup?.name}</h1>
          </div>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex space-x-4'>
              <Input type='text' id='message-input' placeholder='Type your message...' />
              <Button id='send-button'>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {weeks?.map((weekId) => (
        <Week groupId={activeGroup?.id!} weekId={weekId} />
      ))}
    </div>
  );
}

export default MainContent;
