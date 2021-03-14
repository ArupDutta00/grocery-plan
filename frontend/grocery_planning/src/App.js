import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style/App.css'



const App=()=> {

    const today = new Date()
    const monthName = today.toLocaleString('default', { month: 'long' })
   
    const[data,setData]=useState([]);

    useEffect(()=>{
        getData();
    },[]);


    const getData = () =>{
        axios.get('/grocery/getAll').then((res)=>{
           // console.log(res.data)
            setData(res.data);
        },(err)=>{
            console.log(err);
        })
    }

    const [item, setItem] = useState({
        groceryItem:"",
        isPurchased:false
    });

   
    const inputEvent = (event) => {
        // console.log(event);
            // const name = event.target.name;
            // const value = event.target.value;

        const { name, value } = event.target;

        setItem((previousValue) => {
            
            return {
                ...previousValue,
                [name]: value
            }
        })
    }
    const addItem = () => {
       if(item.groceryItem!==""){
        var newNote={
            groceryItem:item.groceryItem,
            isPurchased:item.isPurchased
        }    
        axios.post('/grocery/add', newNote)

        getData();
      } 
       else{
           alert("Enter Item for shopping")
       }
    }


    const eventHandle = (event)=>{
        event.preventDefault()
    }
    const deleteData = (index,item)=>{
        console.log(index);

        const data={
            _id:item._id
        }

        axios.delete("/grocery/deleteGroceryItem",{data})

        getData();

        }


    const PurchaseData =(index,item)=>{
       var element= {
            _id:item._id,
            isPurchased:true
        }
        axios.put("/grocery/updatePurchaseStatus",element)
        getData();
    }
 
    return <div className="main_div">
        <nav className="nav_styling"><h1>Monthly Grocery Planning App</h1></nav>
        <div className="content_styling">
        <h1>Plan for the month of {monthName}</h1>
        <form className="data_insertion" onSubmit={eventHandle}>
            <input type="text" name="groceryItem" value={item.groceryItem} onChange={inputEvent} placeholder="Add Shopping Item"/>
            <button className="btn" onClick={addItem}>Submit</button>       
             <ul>
             {data.map((item,index)=> {
               
                 return <div className="data_styling" key={index}>
                 <li style={{textDecoration:item.isPurchased?"line-through":"none"}}>{item.groceryItem}</li>
                 <div>
                 <button onClick={()=>PurchaseData(index,item)}>Purchase</button>
                 <button onClick={()=>deleteData(index,item)}>X</button></div>
                 </div>       
               
 })}
             </ul>
  
        </form>
        </div>
    </div>
}

export default App

