import React,{useState, useEffect} from 'react';
import BlockLayout from './BlockLayout';

function MenuBlock(props){

    const [items, setItems] = useState([]);

    const getJsonData= ()=> {
        let jsonData;
        let names = [];
        import ('../json/beveragesList.json')
        .then(({ default: data }) => {
                jsonData = data.filter((obj) => {
                    return obj.available === true;
                });
    
                //Create and append the beverage block
                jsonData.forEach((obj) => {
                    names.push(obj.name);
                });
                setItems(names);
            })
            .catch((error) => {
                throw "Unable to load JSON data";
            });
    }
    

    useEffect(()=>{
        getJsonData();
    },[])

    return(
        <>
            {
            props.selectList?
            items.map((item)=>{
                return  <option key={item} value={item}>{item}</option>  
            })
            : <BlockLayout queueClasses="col-md-3 screenColumn h-100 mt-sm-5 mt-4 mt-lg-4 mt-xl-0" heading="BEVERAGE MENU" menu items={items}/>
            }          
        </>
    )
}




export default MenuBlock;