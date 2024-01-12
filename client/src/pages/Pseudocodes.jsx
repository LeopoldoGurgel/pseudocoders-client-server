import React, {useState, useEffect} from "react";
import { useQuery } from "@apollo/client";
import { QUERY_POSTS, QUERY_USERS } from "../utils/queries";
import OlderPostsModal from '../components/OlderPostsModal';

const Pseudocodes = ({handlePageChange}) => {
    const {loading: postsLoading, error: postsError, data: postsData} = useQuery(QUERY_POSTS);
    const {loading: userLoading, error: userError, data: userData} = useQuery(QUERY_USERS);

    const [postArray, setPostArray] = useState([]);    
    const [isModalOpen, setModalOpen] = useState(false);
  
    useEffect(()=>{
        if(!postsLoading && postsData){
            const posts = postsData?.posts || [];
            setPostArray(posts.slice(0, 10));            
        }
    }, [postsLoading, postsData]);

    if(postsLoading || userLoading) {        
        return <div>Loading...</div>
    }

    if(postsError || userError){
        return <div>Error: {postsError.message || userError.message}</div>
    }

    const toggleModal = () => setModalOpen(!isModalOpen);
    const closeModal = () => setModalOpen(false);

  

    return(
        <div>
            <h2 className="mb-4">Pseudocodes</h2>
            <div>
                <div>
                    <div className="hstack mb-3">
                        <h4 className="d-inline-block">Latest Posts</h4>
                        <button 
                        className="d-inline-block ms-auto btn btn-dark"
                        onClick={toggleModal}>Older Posts</button>
                        {isModalOpen && (<OlderPostsModal show={isModalOpen} onHide={closeModal} handlePageChange={handlePageChange}/>)}
                    </div>

                    {postArray.map((post) => (     
                                            
                            <div key={post._id} className="row border-top border-secondary p-2" >                                
                                <h5 className="col-10 cursor-pointer"><a onClick={()=>handlePageChange('Pseudocode', post)}  >{post.title}</a></h5>
                                <p className="col-10 cursor-pointer"><a onClick={()=>handlePageChange('Pseudocode', post)} >{`${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}`}</a></p>
                                <p className="text-secondary">{
                                    userData && userData.users.map((user)=>{
                                        if(user._id === post.author){
                                            return <span key={user._id}>{user.name} at </span>
                                        }
                                    })
                                    }{post.createdAt}</p>
                            </div>
                    ))}                   
                </div>                                                           
            </div>
        </div>
    )
};

export default Pseudocodes;