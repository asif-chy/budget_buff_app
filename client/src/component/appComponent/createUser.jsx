import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

function CreateUser(props) {

  const [user, setUser] = React.useState({
    _id: "",
    userName: "",
    _v: ""
  });

  function addUser(event) {
    const { name, value } = event.target;

    let nameUpperCase = value.toUpperCase();
    console.log(nameUpperCase);

    setUser(previouseValue => {
      return {
        ...previouseValue,
        [name]: nameUpperCase,
      };
    })
  }

  useEffect(() => {
    console.log(user);

    if (user._id) {
      props.onAdd(user);
    }

  }, [user._id]);

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Before Save Call");

    let existingUserList = props.listOfUser;
    console.log(existingUserList);
    if (existingUserList) {
      let listLength = existingUserList.length;
      console.log(listLength);
      for (let start = 0; start < listLength; start++) {
        console.log(user.userName);
        if (existingUserList[start].userName == user.userName) {
          swal("Oops! User Name already exists", { button: false });
          return false;
        }
      }
    }

    const res = await axios.post('http://localhost:9000/save', { user });

    // console.log(res);
    // console.log(res.data.id);

    const itemId = res.data.id;

    await setUser(previousValue => {
      return {
        ...previousValue,
        _id: itemId,
      };
    })

  }

  return (
    <form onSubmit={handleSubmit} className="createUserForm">

      <input onChange={addUser} type="text" name="userName" placeholder="Add User" id="createUserInput"></input>
      <button type="submit" id="createUserButton"><i className="fa fa-plus fa-3x"></i></button>

    </form>
  )
}

export default CreateUser;