import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import FirestoreService, { Like } from '@/services/firestore-service';
import React, { useEffect, useState } from 'react';

type LikeProps = {
    like: Like;
}

const LikeComponent: React.FC<LikeProps> = (props) => {

    const [userName, setUserName] = useState("");
    const [userPhotoUrl, setUserPhotoUrl] = useState("");

    useEffect(() => {
        const fetchUserName = async () => {
            if (props.like && props.like.userId) {
                const user = await FirestoreService.getInstance().getUser(props.like.userId);
                setUserName(user?.name);
                setUserPhotoUrl(user?.photoUrl);
            }
        };
        fetchUserName();
    }, [props.like]);


    return (
        <div>
            <HoverCard>
                <HoverCardTrigger>
                    <Avatar className='h-7 w-7'>
                        <AvatarImage src={userPhotoUrl}></AvatarImage>
                        <AvatarFallback style={{ color: 'black' }}>{userName ? userName[0].toUpperCase() : ''}</AvatarFallback>
                    </Avatar>
                    <HoverCardContent>
                        {userName}
                    </HoverCardContent>
                </HoverCardTrigger>
            </HoverCard>
        </div>
    );
};

export default LikeComponent;

