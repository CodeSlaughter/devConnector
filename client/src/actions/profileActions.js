import axios from 'axios';
import { GET_PROFILE, PROFILE_LOADING, GET_ERRORS, CLEAR_CURRENT_PROFILE } from './types';

//Action creators
//profile loading
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    }
}

//clear profile
export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE
    }
}

//Get current profile
export const getCurrentProfile = () => dispatch => {
    dispatch(setProfileLoading());
    axios
    .get('/api/profile')
    .then(res => {
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    })
    .catch(er => {
        dispatch({
            type: GET_PROFILE,
            payload: {}
        })
    });
}