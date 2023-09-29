import { useEffect, useState } from 'react';
import FirestoreService, { Entry, Week } from '@/services/firestore-service';
import { User } from 'firebase/auth';
import EntryComponent from './Entry/Entry';

const WeekComponent = ({ groupId, week, user, fetchHasEntryThisWeek, refreshContent }: { groupId: string | null, week: Week, user: User, fetchHasEntryThisWeek: () => Promise<void>, refreshContent: boolean }) => {

  
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
      {entries.length > 0 && <h1>Week: {week.startDate.toLocaleDateString()} - {week.endDate.toLocaleDateString()}</h1>}
      {entries.map((entry) => (
        <EntryComponent
          key={entry.id}
          entry={entry}
          user={user}
          setRefreshEntries={setRefreshEntries}
          fetchHasEntryThisWeek={fetchHasEntryThisWeek}
          groupId={groupId}
          weekId={week.id}
        />))}
    </>
  );
};

export default WeekComponent;