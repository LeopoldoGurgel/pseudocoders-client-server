import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_COMMENT, QUERY_USERS } from "../utils/queries"
import { REMOVE_POST_COMMENT, ADD_REPLY, REMOVE_REPLY } from "../utils/mutations";
import Auth from '../utils/auth';


const Comment = ({comment, postData}) => {

    const [showReply, setShowReply] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [visitorsData, setVisitorsData] = useState({});
    const [commentState, setCommentState] = useState({});
    const [deletedComments, setDeletedComments] = useState([]);
    const [ error, setError] = useState('');
    
          
    const { loading: visitorLoading, error: visitorError } = useQuery(QUERY_USERS, {
        onCompleted: (data) => setVisitorsData(data),
        });         

    
    const {data: commentData, loading: commentLoading, error: commentError} = useQuery(QUERY_COMMENT, {
        variables: {commentId: comment._id},
        onCompleted: (commentData) => {
            setCommentState(commentData)
        }
    })
    

    // Mutations
    const [addReply, {addReplyError, addReplyData}] = useMutation(ADD_REPLY);
    const [removeComment, {removeCommentError, removeCommentData}] = useMutation(REMOVE_POST_COMMENT);
    const [removeReply, {removeReplyerror, removeReplyData}] = useMutation(REMOVE_REPLY)

    
    
    const handleSendReply = async (e) => {
        e.preventDefault();

        try {
            const {data} = await addReply({
                variables: {COMMENT_Id: comment._id, content: replyContent}
            });

            let newReply = {
                id: Math.random(),
                author: Auth.getProfile()?.data?._id,
                content: replyContent,
                comments: [],
                createdAt: 'Just posted'
            }

            setCommentState((prevData) => ({
                ...prevData,
                comment: {
                    ...prevData.comment,
                    comments: [
                        ...prevData.comment.comments,
                        newReply
                    ]
                }
            }))
            setShowReply(!showReply)
            setReplyContent('')
            console.log('Reply sent: ', data)
        } catch (error) {
            console.log("Error: ", error.message)
            setError(error.message)
        }
    }

    const handleDelete = async (e, parent, child) => {
        e.preventDefault();
        
        try {
            if(parent.__typename == 'Comment') {
            const {data} = await removeReply({
                variables: {
                    COMMENT_Id: parent._id,
                    commentId: child._id
                },                
            });             
            }
        
            if(parent.__typename == 'Post') {
                const {data}= await removeComment({
                    variables: {
                        postId: parent._id,
                        commentId: child._id
                    }
                });
            }

            setDeletedComments([...deletedComments, child._id])

            console.log('deleted comments array : ', deletedComments, '      comment id: ', comment._id)
            
            console.log('Comment deleted')

        } catch (error) {
            'Error: ', error.message
        }
    }
 
   
    
    return (
        <div>
            {deletedComments.includes(comment._id) ? (
                <div>
                    <p className="text-danger mt-5">Comment deleted successfully</p>
                </div>
            ) : (
                <div className= {`box border-top border-secondary mt-3 p-4`} >
                            <div className="hstack">
                                {visitorsData.users && visitorsData.users.map((user)=>{
                                    if(comment.author == user._id){
                                        return <p><strong>{user.name}</strong> says:</p>
                                    }
                                })}
                                {comment.author == Auth.getProfile()?.data._id && <div className="ms-auto">
                                    <button className="btn text-primary">edit</button>
                                    <button className="btn text-danger"
                                    onClick={(e) => {
                                        handleDelete(e, postData, comment)}} >delete</button>
                                </div>}
                            </div>                            
                            <p className="ms-4">{comment.content}</p>
                            <p className="ms-4"><span className="text-secondary ">{comment.createdAt}</span></p>
                            {!showReply && <button className={"btn btn-sm btn-outline-dark"}
                            onClick={() => setShowReply(!showReply)} >Reply</button>}
                            {showReply && (<form>
                                <textarea className="w-100 mt-2" rows="1"
                                value= {replyContent}
                                onChange={(e)=>setReplyContent(e.target.value)} ></textarea>
                                <button className="btn btn-dark btn-sm"
                                onClick={handleSendReply} >Send</button>
                                {error && <p className="text-danger p-2">{error}</p>}
                            </form>)}

                            {/* 
                            /////////////////////////////////////////////////////////////////////////////////
                            COMMENT REPLIES 
                            /////////////////////////////////////////////////////////////////////////////////
                            */}
                            <div className="ms-4">
                            {commentState?.comment?.comments?.map((reply) => (
                                <Comment
                                key={reply._id}
                                comment={reply}
                                postData={commentState?.comment}                                
                            /> 
                            ))}
                            </div>
                            
                        </div>
            )}            
        </div>
    )
}

export default Comment;