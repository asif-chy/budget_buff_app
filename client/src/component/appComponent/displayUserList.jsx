import React from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

function DisplayUserList(props) {

    const userData = [props.item._id, props.item.userName];


    function handleSubmit(event) {
        event.preventDefault();

        console.log(props.item._id)
        props.delete(props.item._id)
        const item = props.item;

        try{
            axios.delete('/deleteUser', { data: { item } });
            axios.delete('/deleteUserData', { data: { item } });
        }catch{
            console.log("Error Deleting User");
        }

    }

    return (
        <form onSubmit={handleSubmit} className="displayUserForm">

            <Link id="displayUserLink"
                to={{
                    pathname: "/budget",
                    userData
                }}
            >{props.item.userName}</Link>

            <button type="submit" id="displayUserDeleteButton"><i className="fa fa-trash"></i></button>
        </form>
    )
}

export default DisplayUserList;
