import { database } from './firestoreAccess';
// import '../Index_Page/addDataToLocalStorageFromFirebase';



//Add onclick event for inTheQueue article, so that a callback function is executed when any of 
//the customerOrders is clicked from that queue. - (This happens because of Event bubbling)

export const inTheQueueClicked = (event) => {
    if (event.target.classList[0] == "name_drink" || event.target.parentElement.classList[0] == "name_drink") {
        let customerOrderDiv;
        let customerId;
        if (event.target.classList[0] == "name_drink") {
            customerOrderDiv = event.target;
        } else {
            customerOrderDiv = event.target.parentElement;
        }
        //customerId is the index number to access the customer's data in the localStorage
        customerId = customerOrderDiv.id;
        let beingMixed = document.getElementById("beingMixed");
        let newCustomerOrderDiv = shiftToNextQueue(customerOrderDiv, beingMixed);
        updateFirestore(newCustomerOrderDiv, customerId, beingMixed.id);
    }
}


//Add onclick event for beingMixed article, so that a callback function is executed when any of 
//the customerOrders is clicked from that queue. - (This happens because of Event bubbling)


export const beingMixedClicked = (event) => {
    if (event.target.classList[0] == "name_drink" || event.target.parentElement.classList[0] == "name_drink") {
        let customerOrderDiv;
        let customerId;
        if (event.target.classList[0] == "name_drink") {
            customerOrderDiv = event.target;
        } else {
            customerOrderDiv = event.target.parentElement;
        }
        //customerId is the index number to access the customer's data in the localStorage
        customerId = customerOrderDiv.id;
        let readyToCollect = document.getElementById("readyToCollect");
        let newCustomerOrderDiv = shiftToNextQueue(customerOrderDiv, readyToCollect);
        updateFirestore(newCustomerOrderDiv, customerId, readyToCollect.id);
    }
}



export const readyToCollectClicked = (event) => {
    if (event.target.classList[0] == "name_drink" || event.target.parentElement.classList[0] == "name_drink") {
        let customerOrderDiv;
        let customerId;
        if (event.target.classList[0] == "name_drink") {
            customerOrderDiv = event.target;
        } else {
            customerOrderDiv = event.target.parentElement;
        }
        //customerId is the index number to access the customer's data in the localStorage
        customerId = customerOrderDiv.id;

        deleteOrderFromQueue(customerOrderDiv, customerId);
        //console.log(customerId);
    }
}

export const deleteOrderFromQueue = (customerOrderDiv, customerId) => {
    //Remove the customer's order from readyToCollect queue
    customerOrderDiv.remove();
    customerId = parseInt(customerId);

    database.collection("customers").get().then(function(snapshot) {
        const doc = snapshot.docs[0];
        let docId = doc.id;
        let customersData = doc.data().customersData;
        let customerOrders = customersData[0];
        let orderQueue = customersData[1];
        let currentCustomersCount = doc.data().currentCustomersCount;

        //Delete the customer's data from Firestore
        delete customerOrders[customerId];
        delete orderQueue[customerId];
        currentCustomersCount--;

        database.collection("customers").doc(docId).update({
            customersData: customersData,
            currentCustomersCount: currentCustomersCount
        });
    });
}



export const shiftToNextQueue = (customerOrderDiv, nextQueue) => {
    let newCustomerOrderDiv = customerOrderDiv.cloneNode(true);
    nextQueue.appendChild(newCustomerOrderDiv);
    customerOrderDiv.remove();
    return newCustomerOrderDiv;
}


export const updateFirestore = (newCustomerOrderDiv, customerId, queueName) => {
    database.collection("customers").get().then((snapshot) => {
        const doc = snapshot.docs[0];
        let docId = doc.id;
        let customersData = doc.data().customersData;
        let customerOrders = customersData[0];
        let orderQueue = customersData[1];
        let index = doc.data().index;


        //Update the customerId with new queueName
        customerId = parseInt(customerId);
        delete orderQueue[customerId];
        orderQueue[index] = queueName;

        //Delete the customerData and update to new one
        let customerData = customerOrders[customerId];
        delete customerOrders[customerId];
        customerOrders[index] = customerData;

        localStorage.setItem("customersData", JSON.stringify(customersData));
        //Giving a new ID to the shifted Div
        newCustomerOrderDiv.id = index;
        index++
        localStorage.setItem("index", index);
        database.collection("customers").doc(docId).update({
            customersData: customersData,
            index: index
        });


    });
}