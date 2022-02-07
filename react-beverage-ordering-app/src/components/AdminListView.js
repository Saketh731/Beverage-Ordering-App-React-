import React,{useEffect, useState, useRef} from 'react';
import execute from '../javascript/getOrdersInTable';
import '../css/adminListView.css';
import Navigation from '../components/Navigation';
import { database } from '../javascript/firestoreAccess.js';
import {useSelector, useDispatch} from 'react-redux';
import {fetchOrders} from '../redux/user/userActions';

function AdminListView(props){
    const [orders, setOrders] = useState({customerOrders: {}, orderQueue: {}, customerIDs: [], queues: {inTheQueue: false, beingMixed: false, readyToCollect: false}});
    const checkBoxRef = useRef(null);
    const shiftQueueRef = useRef(null);

    // const [variable, setVariable] = useState(10);
    const dispatch = useDispatch();
    const showCheckBoxes = toggleCheckBoxes();
    const navs = [{name: "Home", routeTo: "/"}, {name: "Admin Page", routeTo: "/adminview"}];

    useEffect(()=>{  
        dispatch(fetchOrders());
    },[])

    function toggleCheckBoxes() {
        let show = true;
        return function() {
            if (show) {
                checkBoxRef.current.style.display = "block";
                show = false;
            } else {
                checkBoxRef.current.style.display = "none";
                show = true;
            }
        }
    }

    const handleData = (event)=>{
        let queueChecked = event.target.checked;
        let queueId = event.target.id;
        let queueObj = {}
        let queuesSpread = orders.queues;
        if(queueId == "inTheQueue") {
           queueObj = {...queuesSpread, inTheQueue: queueChecked};
        }
        else if(queueId == "beingMixed") {
            queueObj = {...queuesSpread, beingMixed: queueChecked}
        }
        else {
            queueObj = {...queuesSpread, readyToCollect: queueChecked}
        }

        database.collection("customers").get().then(snapshot => {
            let doc = snapshot.docs[0];
            let customersData = doc.data().customersData;
            let customerOrders = customersData[0];
            let orderQueue = customersData[1];
            let customerIDs = Object.keys(customerOrders);
           
            setOrders({customerOrders: customerOrders, orderQueue: orderQueue, customerIDs: customerIDs, queues: queueObj});
           
        });
    }


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

            let queueName = shiftQueueRef.current.value;
            let selectedOrders = document.querySelectorAll("input[type='checkbox']:checked");
           
            selectedOrders.forEach(element => {
               
                if (element.parentElement.id && queueName != "--Shift To Queue--") {
                    let customerId = element.parentElement.id;
                    customerId = parseInt(customerId);


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
                          
                            // let random = Math.random();
                            // setVariable(random);

                            let e1 = {target:{checked: true, id: "inTheQueue"}};
                            handleData(e1);
                            // let customerIDs = Object.keys(customerOrders);
                            // setOrders({...orders, customerOrders: customerOrders, customerIDs: customerIDs});
                            
                            // let od = orders;
                            // let customerIds = orders.customerIDs;
                            // setOrders({...od, customerOrders: customerOrders, orderQueue: orderQueue, customerIDs: customerIds, queues: {inTheQueue: true, beingMixed: true, readyToCollect: true}});
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
                            let e1 = {target:{checked: true, id: "inTheQueue"}};
                            handleData(e1);
                        });
                    }
                }
            });
        });
    }


    return(
        <section className="adminList-section p-5 pt-0 text-white m-0">

            {/* Nav Bar */}
            <Navigation navs={navs}/>

            {/* Select Queues */}
            <section className="position-relative d-inline">
                <div id="selectQueue" className="d-inline" onClick={showCheckBoxes}>
                    <select className="fw-bold py-md-2 px-md-4 py-1 px-2 queuesSelect rounded">
                        <option>--Select Queue--</option>
                    </select>
                </div>
                <div id="checkBoxQueues" className="bg-white text-dark position-absolute" ref={checkBoxRef}>
                    <label htmlFor="inTheQueue" className="ps-4 d-block"> 
                        <input type="checkbox" id="inTheQueue" onChange={handleData}/>
                        In The Queue
                    </label>
                    <label htmlFor="beingMixed" className="ps-4 d-block">
                        <input type="checkbox" id="beingMixed" onChange={handleData}/>
                        Being Mixed
                    </label>
                    <label htmlFor="readyToCollect" className="ps-4 d-block">
                        <input type="checkbox" id="readyToCollect" onChange={handleData}/>
                        Ready To Collect
                    </label>
                </div>
            </section>

            {/* Orders Table */}
            <table id="ordersList" className="border border-white">
                <thead>
                    <tr>
                        <th className="border border-white">ID</th>
                        <th className="border border-white">Customer Name</th>
                        <th className="border border-white">Beverage Name</th>
                        <th className="border border-white">Action</th>
                    </tr>
                </thead>
                {orders.queues.inTheQueue? <TableBody orders={orders} idName="inTheQueue" /> : null}
                {orders.queues.beingMixed? <TableBody orders={orders} idName="beingMixed" /> : null}
                {orders.queues.readyToCollect? <TableBody orders={orders} idName="readyToCollect" /> : null}
                
            </table>

            <div id="submitData" className="text-end mt-4">
                <select id="shiftToQueue" className="fw-bold p-md-2 p-1 me-4 rounded" ref={shiftQueueRef}>
                    <option>--Shift To Queue--</option>
                    <option value="inTheQueue">In The Queue</option>
                    <option value="beingMixed">Being Mixed</option>
                    <option value="readyToCollect">Ready To Collect</option>
                    <option value="deleteOrder">Delete Order</option>
                </select>
                <input type="button" value="Submit" className="fw-bold rounded-pill py-md-2 px-md-5 py-1 px-4 submitChanges" id="updateLocalStorage" onClick={shiftToSelectedQueue}/>
            </div>
        </section>
    )
}


function TableBody(props){

    let queueName = props.idName;


    useEffect(()=>{
        // handleData();
    },[])

    const checkAll = (event) => {
        let checkbox = event.target;
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


    // const showCheckBoxes = toggleCheckBoxes();
   
    const createOrderRow = (id, queueName)=>{
        if (props.orders.orderQueue[id] === queueName) {
            let customerData = props.orders.customerOrders[id];
            let customerDataArray = customerData.split("$");
            let customerName = customerDataArray[0];
            let beverage = customerDataArray[1];

            return <OrderRow queueName={queueName} idValue={id} customerName={customerName} beverage={beverage}/>
        }
    }

    function toggleCheck(event){
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
    }

    return(
         <tbody id={props.idName} onChange={toggleCheck}>
                    <tr> 
                        <td colSpan="4" className="border border-white"><label htmlFor={props.idName+"CheckBox"}>{props.idName.toUpperCase()}</label><input type="checkbox" name={props.idName} id={props.idName+"CheckBox"} onChange={checkAll} style={{verticalAlign: "middle"}}/></td>
                    </tr>
                    {/* <tr>
                        <td>1</td>
                        <td>Saketh</td>
                        <td>Coconut Water</td>
                        <td><input name={props.idName} style={{verticalAlign: "middle"}} type="checkbox" onChange={checkAll}/></td>
                    </tr> */}
                    {props.orders.customerIDs.map((id)=>{
                        return createOrderRow(id, queueName);
                    })}
                    
        </tbody>     
    )
}


function OrderRow(props){
    return(
        <tr>
            <td className="border border-white">{props.idValue}</td>
            <td className="border border-white">{props.customerName}</td>
            <td className="border border-white">{props.beverage}</td>
            <td id={props.idValue} className="border border-white"><input name={props.queueName} type="checkbox"/></td>
        </tr>
    )
}

export default AdminListView;

