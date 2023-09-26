import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FirestoreService, { Comment, Entry, Like } from '@/services/firestore-service';

import { Button } from '@/components/ui/button';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import CommentComponent from './Comment/Comment';
import LikeComponent from './Likes/Likes';
import { TrashIcon } from '@radix-ui/react-icons';

interface EntryComponentProps {
    entry: Entry;
    user: User;
    setRefreshEntries: React.Dispatch<React.SetStateAction<boolean>>;
    fetchHasEntryThisWeek: () => Promise<void>;
    groupId: string | null;
    weekId: string | null;
    userName: string | null;
}

const EntryComponent = ({ entry, user, setRefreshEntries, fetchHasEntryThisWeek, groupId, weekId, userName }: EntryComponentProps) => {

    const [likes, setLikes] = useState<Like[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentInput, setCommentInput] = useState<string>('');

    const fetchLikesAndComments = async () => {
        const likes = await FirestoreService.getInstance().getLikes(groupId!, weekId!, entry.id);
        const comments = await FirestoreService.getInstance().getComments(groupId!, weekId!, entry.id);
        setLikes(likes);
        setComments(comments);
    };

    useEffect(() => {

        fetchLikesAndComments();
    }, [entry]);

    const handleCommentSubmit = async () => {
        if (commentInput !== '') {
            await FirestoreService.getInstance().createComment(groupId!, weekId!, entry.id, user.uid, commentInput);
            setCommentInput('');
            fetchLikesAndComments();
        }
    };

    return (
        <>
            <div className="relative" key={entry.id}>
                {entry.userId === user.uid &&
                    <Button variant={'ghost'} className="absolute top-0 right-0" onClick={async () => {
                        await FirestoreService.getInstance().deleteEntry(groupId!, weekId!, entry.id);
                        setRefreshEntries(prevState => !prevState); // Toggle refreshEntries state
                        fetchHasEntryThisWeek();
                    }}><TrashIcon></TrashIcon></Button>
                }
                <Card>
                    <CardHeader className="flex">
                        <CardTitle className="text-center"> <p>{userName}</p>
                        </CardTitle>
                        <CardDescription className="text-center">
                            {entry.createdAt && new Date(entry.createdAt.seconds * 1000).toLocaleString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row justify-between">
                        <div className="'w-full md:w-1/2 m-2' text-center">
                            <h3 className='font-bold'>Highlight</h3>
                            <p>{entry.highlight}</p>
                        </div>
                        <div className="'w-full md:w-1/2 m-2' text-center">
                            <h3 className='font-bold'>Lowlight</h3>
                            <p>{entry.lowlight}</p>
                        </div>
                    </CardContent>
                    <CardFooter className='flex-col'>
                        <div className='flex'>
                            <h3>Likes: </h3>
                            {likes.map((like) => (<>
                                <LikeComponent key={like.user_id} like={like} />
                            </>
                            ))}
                            {!likes.some(like => like.user_id === user.uid) && 
                                <Button onClick={async () => {
                                    await FirestoreService.getInstance().createLike(groupId!, weekId!, entry.id, user.uid);
                                    fetchLikesAndComments();
                                }}>Like</Button>
                            }
                        </div>
                        <div className='flex'>
                            <h3>Comments:</h3>
                            {comments.map((comment, index) => (
                                <>
                                    <div key={index}>
                                        <CommentComponent comment={comment} />
                                    </div>
                                </>
                            ))}
                        </div>
                        <div className='flex'>
                            <input type='text' value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder='Add a comment...' />
                            <Button onClick={handleCommentSubmit}>Submit</Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>

    );
};

export default EntryComponent;