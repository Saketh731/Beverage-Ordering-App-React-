import React from 'react';
import '../css/home.css'
import { Link } from 'react-router-dom';

 
function HomePage(props){
    //Login Section
    return(
    <section className="d-flex align-items-center outer-section">
        <section className="container">
            <div className="row">
                <div className="col d-flex justify-content-center">
                    <Link to="/customerview">
                        <input type="button" name="customer" id="customer" className="btn btn-lg btn-dark rounded-pill py-3 userButton" value="Customer" />
                    </Link>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col d-flex justify-content-center">
                    <Link to="/adminview">
                    <input type="button" name="admin" id="admin" className="btn btn-lg btn-dark rounded-pill py-3 userButton" value="Admin" />
                    </Link>
                </div>
            </div>
        </section>
    </section>

    )
}

export default HomePage;