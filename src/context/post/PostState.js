import React, { useReducer } from "react";
import PostContext from "./PostContext";
import PostReducer from "./PostReducer";
import {
  GET_POSTS,
  ADD_POST,
  DELETE_POST,
  UPDATE_POST,
  POST_ERROR,
  SET_CURRENT_POST,
  GET_POSTS_COUNT,
} from "../types";
import api from "../../utils/api";
import { toast } from "react-toastify";

const PostState = (props) => {
  const initialState = {
    posts: [],
    totalPosts: null,
    currentPost: null,
    error: null,
  };

  const [state, dispatch] = useReducer(PostReducer, initialState);

  // Get posts
  const getPosts = async (sort, page, pageSize, topic = "") => {
    const sortBy = sort?.sortBy ?? "createdAt";
    const sortOrder = sort?.sortOrder ?? "desc";

    const topicFilter = encodeURIComponent(topic);

    try {
      const res = await api.get(
        `/post?sort=${sortBy},${sortOrder}&page=${page}&limit=${pageSize}&topic=${
          topic && topicFilter
        }`
      );

      dispatch({ type: GET_POSTS, payload: res.data?.data });
      dispatch({ type: GET_POSTS_COUNT, payload: res.data?.total });
    } catch (err) {
      console.error(err);
      dispatch({ type: POST_ERROR, payload: "API Error" });
    }
  };

  // add post
  const addPost = async (post, userToken) => {
    try {
      const res = await api.post("/post", post, {
        // withCredentials: true, // this is absolutely essential to set the cookie in browser
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });

      dispatch({ type: ADD_POST, payload: res.data?.data });
      toast.success("Post added");
    } catch (err) {
      dispatch({ type: POST_ERROR, payload: "API Error" });
      toast.error("Error adding the post", err);
    }
  };

  // update post
  const updatePost = async (post, userToken) => {
    try {
      const res = await api.put(`/post/${post.id}`, post, {
        // withCredentials: true, // this is absolutely essential to set the cookie in browser
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });

      dispatch({ type: UPDATE_POST, payload: res.data?.data });
      toast.success("Post updated");
    } catch (err) {
      dispatch({ type: POST_ERROR, payload: "API Error" });
      toast.error("Error updating the post", err);
    }
  };

  // delete post
  const deletePost = async (id, userToken) => {
    try {
      await api.delete(`/post/${id}`, {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });

      dispatch({ type: DELETE_POST, payload: id });
      toast.success("Post deleted");
    } catch (err) {
      dispatch({ type: POST_ERROR, payload: "API Error" });
      toast.error("Error deleting the post", err);
    }
  };

  // set current post
  const setCurrentPost = (post) => {
    dispatch({ type: SET_CURRENT_POST, payload: post });
  };

  return (
    <PostContext.Provider
      value={{
        posts: state.posts,
        totalPosts: state.totalPosts,
        currentPost: state.currentPost,
        error: state.error,
        getPosts,
        addPost,
        updatePost,
        deletePost,
        setCurrentPost,
      }}
    >
      {props.children}
    </PostContext.Provider>
  );
};

export default PostState;
