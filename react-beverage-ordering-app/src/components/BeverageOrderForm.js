import React, {useEffect} from 'react';
import '../css/orderForm.css';
import {Form, Field} from 'react-final-form';
import Navigation from '../components/Navigation';
import {throttleSubmit, storeData, displayMessage} from '../javascript/storeCustomerData';
import MenuBlock from '../components/MenuBlock';
import {useSelector, useDispatch} from 'react-redux';
import {fetchOrders} from '../redux/user/userActions';


function BeverageOrderForm(props){
    const dispatch = useDispatch();
    const navs = [{name: "Home", routeTo: "/"}, {name: "View Your Order", routeTo: "/customerview"}];
    useEffect(()=>{
        dispatch(fetchOrders());
    },[])

    return(
        <section className="beverage-section px-xl-5 px-4 border border-white">

            {/* Nav Bar */}
            <Navigation navs={navs}/>
            
            <h1 className="text-center text-white bodyH1 mb-xl-3 mt-xl-3 mt-5 mb-4">Order Your Beverage</h1>
            <section className="border border-white h-75 d-flex justify-content-center align-items-center">
                <p className="fw-bold position-fixed orderMessage" id="orderPlacedMessage">Your Order is Placed! Please wait in the queue!</p>

                <div className="container w-50">
                    <FormContainer/>
                </div>
                </section>

        </section>
    )
}

function FormContainer(props){
    const waitAndStoreData = throttleSubmit(storeData, 2500);
    const commonClasses = "d-flex justify-content-md-end justify-content-start";
    return(
        <Form
        onSubmit = {waitAndStoreData}
        
        render = {({handleSubmit,  form, submitting, pristine, values })=>(
            <form onSubmit={handleSubmit}>
                <div className="row g-4">
                <Field name="nameLable">
                    {         
                        ({ input, meta })=>(
                            <div className={`col-md-4 col-12 ${commonClasses}`}>
                                <label htmlFor="customerName" className="text-white">Name</label>
                            </div>
                        )                  
                    }
                </Field>
                <Field name="username">
                    {
                        ({ input, meta })=>(
                            <div className={`col-md-6 ${commonClasses}`}>
                                <input type="text" className="border border-white text-white userFill" name="customerName" id="customerName" autoComplete="off" placeholder="Enter Your Name" required/>
                                {meta.error && meta.touched && <span>{meta.error}</span>}
                            </div> 
                        )
                    }
                </Field>
                <Field name="beverageName">
                    {   
                         ({ input, meta })=>(
                            <div className={`col-md-4 col-12  ${commonClasses}`}>
                                <span className="text-white">Beverages</span>
                            </div>
                         )          
                    }
                </Field>
                <Field name="beverageSelect">
                    {
                        ({ input, meta })=>(
                            <div className={`col-md-6  ${commonClasses}`}>
                                <select name="beverageList" className="text-white userFill border border-white" id="beverageList">
                                    <option value="">-Please Select-</option>
                                    <MenuBlock selectList/>
                                </select>
                                {meta.error && meta.touched && <span>{meta.error}</span>}
                            </div>
                        )
                    }
                </Field>

                 <div className={`col-md-4  ${commonClasses}`}>
                     <div></div>
                </div>

                <div className={`col-md-6  ${commonClasses}`}>
                    <button type="submit" className="btn text-black fw-bold bg-white rounded-pill py-md-1 px-md-3 py-0 px-1">Submit</button>
                </div>
                </div>
            </form>
        )}
    />
    )
}


export default BeverageOrderForm;