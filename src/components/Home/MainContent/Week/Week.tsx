import { useEffect, useState } from 'react';
import FirestoreService, { Entry, Week } from '@/services/firestore-service';
import EntryComponent from './Entry/Entry';

const WeekComponent = ({ groupId, week, fetchHasEntryThisWeek, refreshContent }: { groupId: string | null, week: Week, fetchHasEntryThisWeek: () => Promise<void>, refreshContent: boolean }) => {

  const [entries, setEntries] = useState<Entry[]>([]);
  const [refreshEntries, setRefreshEntries] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entries = await FirestoreService.getInstance().getEntriesPerWeek(groupId!, week.id);
        const users: { [key: string]: { name: string } } = {};

        for (const entry of entries) {
          if (entry.userId) {
            const user = await FirestoreService.getInstance().getUser(entry.userId);
            if (user) {
              users[entry.userId] = user;
            }
          }
        }
        setEntries(entries);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };
    console.log("fetching entries")
    fetchEntries();
  }, [week, refreshEntries, refreshContent]);

  return (
    <>
    <div style={{display: 'flex', alignItems: 'center'}}>
    <hr style={{flexGrow: 1, borderColor: 'lightgrey'}} />
      {entries.length > 0 && <h1 style={{margin: '0 10px'}}>Week: {week.startDate.toLocaleDateString('en-GB')} - {week.endDate.toLocaleDateString('en-GB')}</h1>}
      <hr style={{flexGrow: 1, borderColor: 'lightgrey'}} />
    </div>
      {entries.map((entry) => (
        <EntryComponent
          key={entry.id}
          entry={entry}
          setRefreshEntries={setRefreshEntries}
          fetchHasEntryThisWeek={fetchHasEntryThisWeek}
          groupId={groupId}
          weekId={week.id}
        />))}
    </>
  );
};

export default WeekComponent;