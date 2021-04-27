import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

function CreateItem(props) {

    console.log(props.list);

    const [item, setItem] = React.useState({
        itemId: "",
        itemName: "",
        amount: ""
    });

    function addItem(event) {
        const { name, value } = event.target;

        let nameUpperCase = value.toUpperCase();
        console.log(value);
    
        setItem(previouseValue => {
            return {
                ...previouseValue,
                [name]: nameUpperCase,
            };
        })
    }

    useEffect(() => {
        //console.log(item);
        //console.log(item.itemId);
        if (item.itemId) {
            console.log("Adding");
            props.onAdd(item);
        }

        setItem(previousValue => {
            return {
                ...previousValue,
                itemId: null,
            };
        })

    }, [item.itemId]);

    function handleItemCreate(event) {
        event.preventDefault();
        console.log("Before Item Create");

        let listLength = props.list.length;
        let itemIdObject = null;
        let itemIdToSet = null;

        console.log(item.amount + "  AMOUNT");
        if(!item.amount || !item.itemName){
            swal("Oops! Please enter item name and price", { button: false });
            return false;
        }

        if (listLength != 0) {
            itemIdObject = props.list[listLength - 1];
            itemIdToSet = parseInt(itemIdObject.itemId + 1);
        } else {
            itemIdToSet = 1;
        }

        //console.log(itemIdToSet);
        setItem(previousValue => {
            return {
                ...previousValue,
                itemId: itemIdToSet,
            };
        })
    }

    return (
        <div className="budgetListCreateItem">
            <input type="text" name="itemName" placeholder="ADD ITEM" onChange={addItem} id="createItemInput"></input>
            <input type="number" required="required" max="999999999" name="amount" placeholder="ADD AMOUNT" onChange={addItem} id="createItemPrice"></input>
            <button type="button" onClick={handleItemCreate} id="createItemButton"><i className="fa fa-plus fa-2x"></i></button>
        </div>
    )
}

export default CreateItem;