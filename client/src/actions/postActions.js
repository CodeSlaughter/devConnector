import axios from 'axios';

import { 
    ADD_POST,
    GET_POSTS,
    GET_ERRORS,
    POST_LOADING,
    DELETE_POST,
    GET_POST
} from './types'

//Set loading state
export const setPostLoading = () => {
    return {
        type: POST_LOADING,
        payload: true
    }
}

//Add post
export const addPost = postData => dispatch => {
    axios
        .post('/api/posts', postData)
        .then(res => dispatch({
            type: ADD_POST,
            payload: res.data
        }))
        .catch(er => dispatch({
            type: GET_ERRORS,
            payload: er.response.data
        }))
}

//Get posts
export const getPosts = () => dispatch => {
    dispatch(setPostLoading());
    axios
        .get('/api/posts')
        .then(res => dispatch({
            type: GET_POSTS,
            payload: res.data
        }))
        .catch(er => dispatch({
            type: GET_POSTS,
            payload: null
        }))
}

//Get post
export const getPost = (id) => dispatch => {
    dispatch(setPostLoading());
    axios
        .get(`/api/posts/${id}`)
        .then(res => dispatch({
            type: GET_POST,
            payload: res.data
        }))
        .catch(er => dispatch({
            type: GET_POST,
            payload: null
        }))
}

//Delete post
export const deletePost = id => dispatch => {
    axios
        .delete(`/api/posts/${id}`)
        .then(res => dispatch({
            type: DELETE_POST,
            payload: id
        }))
        .catch(er => dispatch({
            type: GET_ERRORS,
            payload: er.response.data
        }))
}

//Add like to a post
export const addLike = id => dispatch => {
    axios
        .post(`/api/posts/like/${id}`)
        .then(res => dispatch(getPosts()))
        .catch(er => dispatch({
            type: GET_ERRORS,
            payload: er.response.data
        }))
}

//Remove like from a post
export const removeLike = id => dispatch => {
    axios
        .post(`/api/posts/unlike/${id}`)
        .then(res => dispatch(getPosts()))
        .catch(er => dispatch({
            type: GET_ERRORS,
            payload: er.response.data
        }))
}

//Add comment
export const addComment = (postId, commentData) => dispatch => {
    axios
        .post(`/api/posts/comment/${postId}`, commentData)
        .then(res => dispatch({
            type: GET_POST,
            payload: res.data
        }))
        .catch(er => dispatch({
            type: GET_ERRORS,
            payload: er.response.data
        }))
}