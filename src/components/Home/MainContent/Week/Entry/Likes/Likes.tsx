import FirestoreService, { Like } from '@/services/firestore-service';
import React, { useEffect, useState } from 'react';

type LikeProps = {
   like: Like;
}

const LikeComponent: React.FC<LikeProps> = (props) => {

    const [userName, setUserName] = useState("");

    useEffect(() => {
        const fetchUserName = async () => {
            const user = await FirestoreService.getInstance().getUser(props.like.user_id);
            setUserName(user?.name);
        };
        fetchUserName();
    }, [props.like]);


    return (
        <div>
            {userName}
        </div>
    );
};

export default LikeComponent;

