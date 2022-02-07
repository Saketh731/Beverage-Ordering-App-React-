import React,{useState, useEffect} from 'react';
import {database} from '../javascript/firestoreAccess';
import {inTheQueueClicked, beingMixedClicked, shiftToNextQueue, updateFirestore, readyToCollectClicked, deleteOrderFromQueue} from '../javascript/orderClickEvents';
import {useSelector, useDispatch} from 'react-redux';
import {fetchOrders} from '../redux/user/userActions';

//Renders all three different Queues
function AllQueues(props){
    return(
        <div className="row ordersRow">
            <SingleQueue idName="inTheQueue" queueName="IN THE QUEUE"/>
                             
            <SingleQueue idName="beingMixed" queueName="BEING MIXED"/>
                                   
            <SingleQueue idName="readyToCollect" queueName="READY TO COLLECT"/>
        </div>
    )
}

//Each Single Queue Column
function SingleQueue(props){
    
    // const userType = useSelector((state) => state.user.userType);
    const user = useSelector((state) => state.user);   
    const dispatch = useDispatch();
    // const [orders, setOrders] = useState({customerOrders: {}, orderQueue: {}, customerIDs: []})

    const createOrderDiv = (id)=>{

            //The Queue in which the data belong to
            let queue = user.orders.orderQueue[id];
            if(props.idName === queue)
            {   
                //Get Cutomer Name and Order based on his ID
                let customerData = user.orders.customerOrders[id];
                let customerDataArray = customerData.split("$");
                let customerName = customerDataArray[0];
                let beverage = customerDataArray[1];
                //Create customerOrder block to store it in the respective Queue
                return <OrderDiv key={id} idName={id} beverage={beverage} customerName={customerName} queue={queue} userType={user.userType}/>
            }
            else
            {
                return null;
            }

    }

    // const getOrders = ()=> {
    //     database.collection("customers").get().then((snapshot) => {
    //         const doc = snapshot.docs[0];
    //         let customersData = doc.data().customersData;
    //         let customerOrders = customersData[0];
    //         let orderQueue = customersData[1];
    //         let customerIDs = Object.keys(customerOrders);

    //         setOrders({customerOrders: customerOrders, orderQueue: orderQueue, customerIDs: customerIDs});

    //     });
    // }

    useEffect(()=>{
        // getOrders();
        dispatch(fetchOrders());
    },[]);


    const orderClickEvent= (idName)=>{
        if(user.userType == "customer" && idName === "readyToCollect"){
            return readyToCollectClicked;
        }
        else if(user.userType == "admin" && idName == "inTheQueue"){
            return inTheQueueClicked;
        }
        else if(user.userType == "admin" && idName == "beingMixed"){
            return beingMixedClicked;
        }
        else{
            return null;
        }

    }

    return(
        <div className="col">
            <article id={props.idName} onClick={orderClickEvent(props.idName)}>
                <h3 className="fw-bold mt-3 text-center h3Size">{props.queueName}</h3>
                    {user.orders.customerIDs!=null?user.orders.customerIDs.map((id)=>{
                        return createOrderDiv(id);
                    }):null}
            </article>
        </div>
    )
}

//Customer Order Block
function OrderDiv(props){
    return(
        <div className={`name_drink ${props.userType}${props.queue}`} id={props.idName}>
            <div className="drink">{props.beverage}</div>
            <div className="name">{props.customerName}</div>
        </div>
    )
}


export default AllQueues;