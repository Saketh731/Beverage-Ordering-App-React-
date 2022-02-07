import React from 'react';
import {Link} from 'react-router-dom';
import MenuBlock from './MenuBlock';
import QueuesBlock from './QueuesBlock';
import Navigation from './Navigation';

function MenuAndQueues(props){
    const navs = [{name: "Home", routeTo: "/"}, {name: "Place an Order", routeTo: "/beverageorderform"}];
    return(
        <section className="m-0 text-white customer-section">

        {/* Nav Bar */}
        <Navigation navs={navs}/>


        {/* Section to display Menu and Queue  */}
        <section className="container-fluid">

            <div className="row screenRow">
                
                {/* Menu Block */}
                <MenuBlock/>

                {/* Queues Block */}
                <QueuesBlock colWidth="col-md-9"/>
            </div>
        </section>

    </section>
    )
}


export default MenuAndQueues;