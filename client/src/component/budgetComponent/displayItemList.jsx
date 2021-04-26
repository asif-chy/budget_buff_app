import React from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

function DisplayItemList(props) {

    //console.log(props);

    function handleItemDelete(event) {
        event.preventDefault();
        const id = props.item.itemId;
        props.deleteItem(id);
    }


    return (
        <li className="budgetList">
            {/* <h3>{props.item.itemId}</h3> */}
            <h3 id="budgetListDisplayItem">{props.item.itemName}</h3>
            <h4 id="budgetListDisplayPrice">${props.item.amount}</h4>
            <button type="button" onClick={handleItemDelete} id="budgetListDeleteItem"><i className="fa fa-trash"></i></button>
        </li>
    )
}

export default DisplayItemList;