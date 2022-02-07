import { CHANGE_USER_TO_CUSTOMER, CHANGE_USER_TO_ADMIN, FETCH_ORDERS } from './userActionTypes';
import { database } from '../../javascript/firestoreAccess';


const orders = { customerOrders: {}, orderQueue: {}, customerIDs: [] };

export const changeUserToCustomer = () => {
    return {
        type: CHANGE_USER_TO_CUSTOMER
    }

}

export const changeUserToAdmin = () => {
    return {
        type: CHANGE_USER_TO_ADMIN
    }
}

export const usersData = () => {
    return {
        type: FETCH_ORDERS,
        payload: orders
    }
}


//Fetching Data from Firebase
export const fetchOrders = () => {
    return (dispatch) => {
        database.collection("customers").get().then((snapshot) => {
            const doc = snapshot.docs[0];
            let customersData = doc.data().customersData;
            let customerOrders = customersData[0];
            let orderQueue = customersData[1];
            let customerIDs = Object.keys(customerOrders);

            orders.customerOrders = customerOrders;
            orders.orderQueue = orderQueue;
            orders.customerIDs = customerIDs;
            dispatch(usersData());

        });
    }
}