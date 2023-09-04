import React, { useEffect, useState } from 'react';
import FirestoreService, { Entry } from '@/services/firestore-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Week = ({ groupId, weekId }: { groupId: string | null, weekId: string | null }) => {

  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entries = await FirestoreService.getInstance().getEntriesPerWeek(groupId!, weekId!);
        setEntries(entries);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, [weekId]);

  return (
    <>
      <ul>
        {entries.map((entry) => (
          <Card>
            <CardHeader>
              <CardTitle> <p>User ID: {entry.userId}</p>
              </CardTitle>
              <CardDescription>            
                <p>Created At: {entry.createdAt.toString()}</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Highlight: {entry.highlight}</p>
              <p>Lowlight: {entry.lowlight}</p>
            </CardContent>
          </Card>
        ))}
      </ul>
    </>
  );
};

export default Week;