/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import noman from '../../assets/noman.png';
import { capitalizeFirstLetter } from '../util/capitalizeFirstLetter';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiMessageRounded } from 'react-icons/bi';
import { notification } from 'antd';
import './post.css';
import Comment from '../comment/Comment';


const Post = ({ post }) => {
  const { token, user } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isCommentEmpty, setIsCommentEmpty] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showComment, setShowComment] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (post) {
      setIsLiked(post.likes?.includes(user?._id));
     
    }
  }, [post, user]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/comment/${post?._id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (post) {
      fetchComments();
    }
  }, [post, token]);

  const deletePost = async () => {
    try {
      await fetch(`http://localhost:5000/post/${post?._id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        method: 'DELETE'
      });
      localStorage.setItem('postDeleted', 'true');
      window.location.reload();
    } catch (error) {
      console.error(error);
      localStorage.setItem('postDeleted', 'false');
      window.location.reload();
    }
  };
  
  // Add this code to your Post component to handle the notification after the reload
  useEffect(() => {
    const postDeleted = localStorage.getItem('postDeleted');
    if (postDeleted === 'true') {
      notification.success({
        message: "Post deleted successfully",
        placement: "bottomRight",
      });
    } else if (postDeleted === 'false') {
      notification.error({
        message: "Error! Post not deleted",
        placement: "bottomRight",
      });
    }
    localStorage.removeItem('postDeleted');
  }, []);
  
  

  

  const handleLikePost = async () => {
    try {
      await fetch(`http://localhost:5000/post/toggleLike/${post?._id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        method: "PUT"
      });
      setIsLiked(prev => !prev);
    } catch (error) {
      console.error(error);
    }
  };

 

  const handlePostComment = async () => {
    if (commentText === '') {
      setIsCommentEmpty(true);
      setTimeout(() => {
        setIsCommentEmpty(false);
      }, 2000);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/comment`, {
        headers: {
          "Content-Type": 'application/json',
          "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({ commentText, post: post?._id })
      });
      const data = await res.json();
      setComments(prev => [...prev, data]);
      setCommentText('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="post-container">
      <div className="container">
        <div className="wrapper">
          <div className="top">
            <Link to={`/profileDetail/${post?.user?._id}`} className="topLeft">
              {/* <img src={noman} className="profileUserImg"/> */}
              <img src={post?.user?.profileImg ? `http://localhost:5000/images/${post.user.profileImg}` : noman} className="profileUserImg"/>

              <div className="profileMetadata">
                <span>{capitalizeFirstLetter(post?.user?.username)}</span>
                <span>{format(post?.createdAt)}</span>
              </div>
            </Link>
            {
              (user?._id === post?.user?._id) &&
              <HiOutlineDotsVertical size={25} onClick={() => setShowDeleteModal(prev => !prev)} />
            }
            {
              showDeleteModal && (
                <div className="deleteModal">
                  <h3>Delete Post</h3>
                  <div className="buttons">
                    <button onClick={deletePost}>Yes</button>
                    <button onClick={() => setShowDeleteModal(prev => !prev)}>No</button>
                  </div>
                </div>
              )
            }
          </div>
          <div className="center">
            <div className="desc">{post?.desc}</div>
            {post?.location && <div className="location">Location: {post?.location}</div>}
            <img className="postImg" src={post?.photo ? `http://localhost:5000/images/${post?.photo}` : noman} />
          </div>
          <div className={`"controls" ${showComment && showComment}`}>
            <div className="controlsLeft">
              {
                isLiked
                  ? <AiFillHeart onClick={handleLikePost} />
                  : <AiOutlineHeart onClick={handleLikePost} />
              }
              <span className="controlsRight">
              <BiMessageRounded onClick={() => setShowComment(prev => !prev)} />
              </span>
            </div>
           
          </div>
          {
            showComment &&
            <div className='sui'>
              <div className="comments" >
                {
                  comments?.length > 0 ? comments.map((comment) => (
                    <Comment key={comment._id} c={comment} />
                  )) : <span style={{ marginLeft: '12px', fontSize: '20px' }}>No comments</span>
                }
              </div>
              <div className="postCommentSection">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  type="text"
                  className="inputSection"
                  placeholder='Type comment'
                />
                <button onClick={handlePostComment}>Post</button>
              </div>
              {isCommentEmpty && <span className="emptyCommentMsg">You can't post empty comment!</span>}
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Post;
