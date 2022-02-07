import React from 'react';
import BlockLayout from './BlockLayout';

function QueuesBlock(props){
    return(
        <>
            {/* Queues Block */}
            <BlockLayout queueClasses={`${props.colWidth} screenColumn h-100  mt-5 mt-lg-4 mt-xl-0`} heading="BEVERAGE QUEUE" queue/>
        </>
    )
}

export default QueuesBlock;