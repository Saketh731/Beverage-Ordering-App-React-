import React, {useEffect, useState} from 'react';
import '../css/customerView.css';
import MenuAndQueues from '../components/MenuAndQueues';
import {useSelector, useDispatch} from 'react-redux';
import {changeUserToCustomer} from '../redux/user/userActions';


function CustomerView(props){

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(changeUserToCustomer());
    })
    
    return(
        <>
            <MenuAndQueues/>
        </>
    )
} 

export default CustomerView;