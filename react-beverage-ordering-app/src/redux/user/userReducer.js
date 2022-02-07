import { CHANGE_USER_TO_CUSTOMER, CHANGE_USER_TO_ADMIN, FETCH_ORDERS } from './userActionTypes';

const initialState = {
    userType: '',
    orders: {}
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_USER_TO_CUSTOMER:
            return {
                ...state,
                userType: "customer"
            }
        case CHANGE_USER_TO_ADMIN:
            return {
                ...state,
                userType: "admin"
            }
        case FETCH_ORDERS:
            // console.log(action.payload)
            return {
                ...state,
                orders: action.payload
            }
        default:
            return state;
    }
}

export default userReducer;