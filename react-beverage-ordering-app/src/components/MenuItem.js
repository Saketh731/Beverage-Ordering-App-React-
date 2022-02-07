import React from 'react';

function MenuItem(props){
    return(
        <div className="drinkName">
            {props.itemName}
        </div>
    )
}

export default MenuItem;