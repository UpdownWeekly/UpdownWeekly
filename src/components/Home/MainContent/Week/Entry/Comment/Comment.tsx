import FirestoreService, { Comment } from '@/services/firestore-service';
import React, { useEffect, useState } from 'react';

type CommentProps = {
   comment: Comment;
}

const CommentComponent: React.FC<CommentProps> = (props) => {

    const [userName, setUserName] = useState("");

    useEffect(() => {
        const fetchUserName = async () => {
            const user = await FirestoreService.getInstance().getUser(props.comment.userId);
            setUserName(user?.name);
        };
        fetchUserName();
    }, [props.comment]);


    return (
        <div>
            {userName}: {props.comment.text} ({props.comment.created_at.toLocaleTimeString()})
        </div>
    );
};

export default CommentComponent;
