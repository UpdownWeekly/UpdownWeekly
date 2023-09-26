import { useEffect, useState } from 'react';
import FirestoreService, { Entry } from '@/services/firestore-service';
import { User } from 'firebase/auth';
import EntryComponent from './Entry/Entry';

const Week = ({ groupId, weekId, user, fetchHasEntryThisWeek, refreshContent }: { groupId: string | null, weekId: string | null, user: User, fetchHasEntryThisWeek: () => Promise<void>, refreshContent: boolean }) => {

  const [entries, setEntries] = useState<Entry[]>([]);
  const [users, setUsers] = useState<{ [key: string]: { name: string } }>({});
  const [refreshEntries, setRefreshEntries] = useState(false);


  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entries = await FirestoreService.getInstance().getEntriesPerWeek(groupId!, weekId!);
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
        setUsers(users);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };
    console.log("fetching entries")
    fetchEntries();
  }, [weekId, refreshEntries, refreshContent]);

  return (
    <>
      {entries.map((entry) => (
        <EntryComponent
          entry={entry}
          user={user}
          setRefreshEntries={setRefreshEntries}
          fetchHasEntryThisWeek={fetchHasEntryThisWeek}
          groupId={groupId}
          weekId={weekId}
          userName={user.displayName}
        />))}
    </>
  );
};

export default Week;