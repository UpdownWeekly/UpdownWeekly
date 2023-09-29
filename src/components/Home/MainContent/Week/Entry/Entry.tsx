import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FirestoreService, { Comment, Entry, Like } from '@/services/firestore-service';

import { Button } from '@/components/ui/button';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import CommentComponent from './Comment/Comment';
import LikeComponent from './Likes/Likes';
import React from 'react';
import { Heart, HeartOff, Send, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EntryComponentProps {
    entry: Entry;
    user: User;
    setRefreshEntries: React.Dispatch<React.SetStateAction<boolean>>;
    fetchHasEntryThisWeek: () => Promise<void>;
    groupId: string | null;
    weekId: string | null;
}

const EntryComponent = ({ entry, user, setRefreshEntries, fetchHasEntryThisWeek, groupId, weekId }: EntryComponentProps) => {

    const [likes, setLikes] = useState<Like[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentInput, setCommentInput] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [userPhotoUrl, setUserPhotoUrl] = useState<string>('');


    const fetchLikes = async () => {
        const likes = await FirestoreService.getInstance().getLikes(groupId!, weekId!, entry.id);
        setLikes(likes);
    };

    const fetchComments = async () => {
        const comments = await FirestoreService.getInstance().getComments(groupId!, weekId!, entry.id);
        setComments(comments);
    };

    const fetchLikesAndComments = async () => {
        fetchLikes();
        fetchComments();
    };

    const fetchUser = async () => {
        const user = await FirestoreService.getInstance().getUser(entry.userId);
        setUserName(user?.name);
        setUserPhotoUrl(user?.photoUrl);
    };

    useEffect(() => {
        fetchUser();
    }, [entry]);


    useEffect(() => {
        fetchLikesAndComments();
    }, [entry]);

    const handleCommentSubmit = async () => {
        if (commentInput !== '') {
            await FirestoreService.getInstance()
                .createComment(groupId!, weekId!, entry.id, user.uid, user.displayName ?? 'anonymous', commentInput);
            setCommentInput('');
            fetchComments();
        }
    };

    return (
        <>
            <div className="relative" key={entry.id}>
                <Card>
                    <CardHeader className="flex items-center">
                        <CardTitle className="w-full flex justify-between items-center">
                            <div className='flex items-center space-x-2'>
                                <Avatar>
                                    <AvatarImage src={userPhotoUrl}></AvatarImage>
                                    <AvatarFallback style={{ color: 'black' }}>{userName ? userName[0].toUpperCase() : ''}</AvatarFallback>
                                </Avatar>
                                <p>{userName}</p>
                            </div>
                            {entry.userId === user.uid &&
                                <Button variant={'ghost'} onClick={async () => {
                                    await FirestoreService.getInstance().deleteEntry(groupId!, weekId!, entry.id);
                                    setRefreshEntries(prevState => !prevState); // Toggle refreshEntries state
                                    fetchHasEntryThisWeek();
                                }}><Trash /></Button>
                            }
                        </CardTitle>
                        <CardDescription>
                            {entry.createdAt && new Date(entry.createdAt.seconds * 1000).toLocaleString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row justify-between">
                        <div className="'w-full md:w-1/2 m-2 text-center">
                            <h3 className='font-bold mb-2'>Highlight</h3>
                            <p>{entry.highlight}</p>
                        </div>
                        <div className="'w-full md:w-1/2 m-2 text-center">
                            <h3 className='font-bold mb-2' >Lowlight</h3>
                            <p>{entry.lowlight}</p>
                        </div>
                    </CardContent>
                    <CardFooter className='flex-col'>
                        <div className='w-full flex items-center justify-end'>
                            <div className="flex h-5 items-center space-x-1 text-sm">
                                {likes.map((like) => (
                                    <React.Fragment key={like.userId}>
                                        <LikeComponent like={like} />
                                    </React.Fragment>
                                ))}
                            </div>
                            <Button variant={'ghost'} onClick={async () => {
                                if (!likes.some(like => like.userId === user.uid)) {
                                    await FirestoreService.getInstance().createLike(groupId!, weekId!, entry.id, user.uid);
                                    fetchLikes();

                                } else {
                                    await FirestoreService.getInstance().removeLike(groupId!, weekId!, entry.id, user.uid);
                                    fetchLikes();
                                }
                            }}>{likes.some(like => like.userId === user.uid) ? <HeartOff /> : <Heart />}</Button>
                        </div>

                        <div className='w-full flex items-start'>
                            <Accordion type="single" collapsible className='flex-grow'>
                                <AccordionItem value="item-1" className='w-full'>
                                    <AccordionTrigger>Comments ({comments.length})</AccordionTrigger>
                                    <AccordionContent>
                                        {comments.map((comment, index) => (
                                            <React.Fragment key={comment.createdAt.toLocaleTimeString()}>
                                                <div key={index}>
                                                    <CommentComponent comment={comment} />
                                                </div>
                                            </React.Fragment>))}
                                        <div className='flex mt-4'>
                                            <Input type='text' className='focus-visible:ring-0' value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder='Add a comment...' />
                                            <Button variant={'ghost'} onClick={handleCommentSubmit}><Send></Send></Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                        </div>

                    </CardFooter>
                </Card>
            </div>
        </>

    );
};

export default EntryComponent;