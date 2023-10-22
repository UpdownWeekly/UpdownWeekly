import { Comment } from '@/services/firestore-service';

type CommentProps = {
    comment: Comment;
}

const CommentComponent: React.FC<CommentProps> = (props) => {

    return (
        <div>
            <span className="font-semibold">{props.comment.userName ?? 'anonymous'}</span>: {props.comment.text} <span className="text-gray-500">({props.comment.createdAt.toLocaleTimeString('en-GB')})</span>
        </div>
    );
};

export default CommentComponent;
