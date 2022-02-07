import { database } from './firestoreAccess.js';

function execute() {
    //On Page Load make the Checkboxes true by default
    showOrdersList();

    //Making the Parent CheckBox toggle between checked and unchecked based on
    //whether all the child checkboxes are checked or not
    setTimeout(() => {
        let tbodyQueue = document.getElementsByTagName("tbody");
        for (let key = 0; key < tbodyQueue.length; key++) {
            tbodyQueue[key].addEventListener("change", (event) => {
                if (event.target.parentElement.id) {
                    let parentCheckBoxId = event.target.name + "CheckBox";
                    if (event.target.checked == false) {
                        document.getElementById(parentCheckBoxId).checked = false;
                    } else {
                        let flag = 0;
                        let orders = document.getElementsByName(event.target.name);
                        orders.forEach((order) => {
                            if (!order.id && flag != 1) {
                                if (order.checked == true) flag = 0;
                                else flag = 1;
                            }
                        });
                        if (flag == 0) document.getElementById(parentCheckBoxId).checked = true;
                    }
                }
            });
        }
    }, 3000);



    function showOrdersList() {


        let inTheQueue = document.getElementById("inTheQueue");
        let beingMixed = document.getElementById("beingMixed");
        let readyToCollect = document.getElementById("readyToCollect");
        inTheQueue.checked = true;
        beingMixed.checked = true;
        readyToCollect.checked = true;

        handleData(inTheQueue)();
        handleData(beingMixed)();
        handleData(readyToCollect)();


    }


    const showCheckBoxes = toggleCheckBoxes();
    document.getElementById("selectQueue").addEventListener("click", showCheckBoxes);

    //Toggles between showing and hiding the checkboxes
    function toggleCheckBoxes() {
        let show = true;
        return function() {
            let checkBoxQueues = document.getElementById("checkBoxQueues");
            if (show) {
                checkBoxQueues.style.display = "block";
                show = false;
            } else {
                checkBoxQueues.style.display = "none";
                show = true;
            }
        }
    }

    //Select all CheckBoxes of the respective queue by clicking one main CheckBox
    function checkAll(checkbox) {
        return () => {
            if (checkbox.checked === true) {
                let queue = document.getElementsByName(checkbox.name);
                queue.forEach(element => {
                    element.checked = true;
                });
            } else {
                let queue = document.getElementsByName(checkbox.name);
                queue.forEach(element => {
                    element.checked = false;
                });
            }
        }
    }

    //Get Data from Firebase and store it in your table
    function handleData(checkbox) {
        return () => {
            database.collection("customers").get().then(snapshot => {
                let doc = snapshot.docs[0];
                let customersData = doc.data().customersData;
                let customerOrders = customersData[0];
                let orderQueue = customersData[1];
                let customerIDs = Object.keys(customerOrders);

                //If Checked 
                if (checkbox.checked == true) {
                    //The Queue in which the data belong to
                    let queue = checkbox.id;

                    //Create a Row representing the Customer Data in particular Queue
                    let customersQueueData = document.createElement("tbody");
                    customersQueueData.id = queue + "Row";
                    document.getElementById("ordersList").appendChild(customersQueueData);

                    //Creating a table cell representing the Queue Name and a Checkbox
                    let queueNameRow = document.createElement("tr");
                    customersQueueData.appendChild(queueNameRow);
                    let queueNameCell = document.createElement("td");
                    queueNameRow.appendChild(queueNameCell);
                    queueNameCell.colSpan = 4;
                    //Label
                    let queueNameLabel = document.createElement("LABEL");
                    queueNameLabel.htmlFor = queue + "CheckBox";
                    if (queue == "inTheQueue") queueNameLabel.innerHTML = "In The Queue ";
                    else if (queue == "beingMixed") queueNameLabel.innerHTML = "Being Mixed ";
                    else queueNameLabel.innerHTML = "Ready To Collect ";
                    queueNameCell.appendChild(queueNameLabel);
                    //CheckBox
                    let queueNameCheckBox = document.createElement("input");
                    queueNameCheckBox.type = "checkbox";
                    queueNameCheckBox.name = queue;
                    queueNameCheckBox.id = queue + "CheckBox";
                    queueNameCheckBox.style.verticalAlign = "middle";
                    let checkAllFunction = checkAll(queueNameCheckBox);
                    queueNameCheckBox.addEventListener("change", checkAllFunction);
                    queueNameCell.appendChild(queueNameCheckBox);

                    //Create a Table Row for each Customer Order in a specific Queue
                    customerIDs.forEach(id => {
                        if (orderQueue[id] === checkbox.id) {
                            //Get Cutomer Name and Order based on his ID
                            let customerData = customerOrders[id];
                            let customerDataArray = customerData.split("$");
                            let customerName = customerDataArray[0];
                            let beverage = customerDataArray[1];
                            //ROW
                            let customerRow = document.createElement("tr");
                            let rowID = orderQueue[id] + "Row";
                            document.getElementById(rowID).appendChild(customerRow);
                            //ID
                            let ID = document.createElement("td");
                            ID.innerHTML = id;
                            customerRow.appendChild(ID);
                            //Name
                            let name = document.createElement("td");
                            name.innerHTML = customerName;
                            customerRow.appendChild(name);
                            //Beverage
                            let drink = document.createElement("td");
                            drink.innerHTML = beverage;
                            customerRow.appendChild(drink);
                            //CheckBox
                            let selectData = document.createElement("td");
                            selectData.id = id;
                            customerRow.appendChild(selectData);
                            let inputCheckBox = document.createElement("input");
                            inputCheckBox.type = "checkbox";
                            inputCheckBox.name = orderQueue[id];
                            selectData.appendChild(inputCheckBox);
                        }
                    });
                }

                //If Unchecked
                else {
                    let rowID = checkbox.id + "Row";
                    let orders = document.getElementById(rowID);
                    orders.remove();
                }
            });
        }

    }

    const inTheQueueElement = document.getElementById("inTheQueue");
    const beingMixedElement = document.getElementById("beingMixed");
    const readyToCollectElement = document.getElementById("readyToCollect");
    const inTheQueueFunction = handleData(inTheQueueElement);
    const beingMixedFunction = handleData(beingMixedElement);
    const readyToCollectFunction = handleData(readyToCollectElement);

    inTheQueueElement.addEventListener("change", inTheQueueFunction);
    beingMixedElement.addEventListener("change", beingMixedFunction);
    readyToCollectElement.addEventListener("change", readyToCollectFunction);



    // Shift all the checked orders to the selected Queue
    function shiftToSelectedQueue() {
        database.collection("customers").get().then((snapshot) => {
            let doc = snapshot.docs[0];
            let docId = doc.id;
            let customersData = doc.data().customersData;
            let customerOrders = customersData[0];
            let orderQueue = customersData[1];
            let currentCustomersCount = doc.data().currentCustomersCount;
            let index = doc.data().index;

            let queueName = document.getElementById("shiftToQueue").value;
            let selectedOrders = document.querySelectorAll("input[type='checkbox']:checked");

            selectedOrders.forEach(element => {
                if (element.parentElement.id && queueName != "--Shift To Queue--") {
                    let customerId = element.parentElement.id;
                    customerId = parseInt(customerId);

                    //NEW
                    element.checked = false;
                    element.name = queueName;
                    let parentCheckBox = element.name + "CheckBox";
                    document.getElementById(parentCheckBox).checked = false;


                    if (queueName != "deleteOrder") {
                        //Update the customerId with new queueName
                        delete orderQueue[customerId];
                        orderQueue[index] = queueName;

                        //Delete the customerData and update to new one
                        let customerData = customerOrders[customerId];
                        delete customerOrders[customerId];
                        customerOrders[index] = customerData;

                        //Update the index count in Firestore
                        index++

                        database.collection("customers").doc(docId).update({
                            customersData: customersData,
                            index: index
                        }).then(function() {
                            // showOrdersList();

                            window.location.reload();

                            //NEW
                            // element.parentElement.id = index - 1;
                            // let orderSelected = element.parentElement.parentElement;
                            // let orderCloned = orderSelected.cloneNode(true);
                            // orderSelected.remove();
                            // let queueShift = queueName + "Row";
                            // document.getElementById(queueShift).appendChild(orderCloned);

                        });

                    } else {
                        //Delete the customer's data from Firestore
                        delete customerOrders[customerId];
                        delete orderQueue[customerId];

                        currentCustomersCount--;

                        database.collection("customers").doc(docId).update({
                            customersData: customersData,
                            currentCustomersCount: currentCustomersCount
                        }).then(function() {
                            // showOrdersList();

                            window.location.reload();

                            //NEW
                            // let orderSelected = element.parentElement.parentElement;
                            // orderSelected.remove();
                        });
                    }
                }
            });
        });
    }

    document.getElementById("updateLocalStorage").addEventListener("click", shiftToSelectedQueue);
}


export default execute;