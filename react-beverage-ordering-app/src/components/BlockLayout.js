import React from 'react';
import AllQueues from './AllQueues';
import MenuItem from './MenuItem';

function BlockLayout(props){
    return(
        <div className={props.queueClasses}>
            <article className="h-100">
                <h2 className="mt-1 mb-2 text-center text-uppercase fw-bold h2Size">{props.heading}</h2>
                <section className="overflow-auto border border-white h-100 container-fluid scrollBar" id={props.blockId}>
                    {/* { props.id? <AllQueues/>: null} */}
                    {props.queue? <AllQueues/>: props.items.map(item=>{
                                    return <MenuItem key={item} itemName={item}/>
                                })}
                </section>
            </article>
        </div>
    )   
}

export default BlockLayout;