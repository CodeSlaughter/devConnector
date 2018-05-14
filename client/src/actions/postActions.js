import axios from 'axios';

import { 
    ADD_POST,
    GET_ERRORS
} from './types'

//Add post
export const addPost = postData => dispatch => {
    axios
        .post('/api/posts', postData)
        .then(res => dispatch({
            type: ADD_POST,
            payload: red.data
        }))
        .catch(er => dispatch({
            type: GET_ERRORS,
            payload: er.response.data
        }))
}