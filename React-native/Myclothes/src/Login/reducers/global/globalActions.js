/**
 * Created by vjtc0n on 9/7/16.
 */
const {
    SET_SESSION_TOKEN,
    SET_STORE,
    SET_STATE,
    GET_STATE
} = require('../../lib/constants').default;

/*export function setSessionToken (sessionToken) {
 return {
 type: SET_SESSION_TOKEN,
 payload: sessionToken
 }
 }*/
/**
 * ## set the store
 *
 * this is the Redux store
 *
 * this is here to support Hot Loading
 *
 */
export function setStore (store) {
    return {
        type: SET_STORE,
        payload: store
    }
}
/**
 * ## set state
 *
 */
export function setState (newState) {
    return {
        type: SET_STATE,
        payload: newState
    }
}
/**
 * ## getState
 *
 */
export function getState (toggle) {
    return {
        type: GET_STATE,
        payload: toggle
    }
}