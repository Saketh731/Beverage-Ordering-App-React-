import React,{useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import '../css/customerView.css';
import '../css/adminView.css';
import QueuesBlock from '../components/QueuesBlock';
import { changeUserToAdmin } from '../redux/user/userActions';
import Navigation from '../components/Navigation';

function AdminView(props){

    // const user = useSelector((state) => state.user.userType);
    const dispatch = useDispatch();
    const navs = [{name: "Home", routeTo: "/"}, {name: "Customer View Page", routeTo: "/customerview"}, {name: "Orders List", routeTo: "/adminlistview"}];

    useEffect(()=>{
        // adminClickEvents();
        dispatch(changeUserToAdmin());
    })
    
    return(
        <section className="m-0 text-white customer-section">
            

            <Navigation navs={navs}/>


            <section className="container-fluid">

                <div className="row screenRow">
                    {/* Queues Block */}
                    <QueuesBlock colWidth="col-12"/>
                </div>

            </section>
        </section>
    )
}

export default AdminView;