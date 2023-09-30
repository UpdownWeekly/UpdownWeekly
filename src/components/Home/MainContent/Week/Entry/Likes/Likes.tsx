import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Avatar className='h-6 w-6'>
                            <AvatarImage src={userPhotoUrl}></AvatarImage>
                            <AvatarFallback style={{ color: 'black' }}>{userName ? userName[0].toUpperCase() : ''}</AvatarFallback>
                        </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                        {userName}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default LikeComponent;

