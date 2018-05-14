import axios from 'axios';

import { 
    ADD_POST,
    GET_POSTS,
    GET_ERRORS,
    POST_LOADING
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