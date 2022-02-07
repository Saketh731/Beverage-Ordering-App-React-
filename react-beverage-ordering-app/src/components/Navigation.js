import React from 'react';
import {Link} from 'react-router-dom';

function Navigation(props){
    return(
        <>
            {/* Nav Bar */}
            <nav className="navbar  d-flex justify-content-end p-0 pt-2">
                <ul className="nav me-0">
                    {props.navs.map((nav)=>{
                        return <Link to={nav.routeTo}>
                                    <li className="nav-item navList fw-bold p-0 px-1 py-0 rounded me-3">
                                        {nav.name}
                                    </li>
                                </Link>
                    })}
                </ul>
            </nav>
        </>
    )
}


export default Navigation;