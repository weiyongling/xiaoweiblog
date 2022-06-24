import React from 'react';
import {NavLink} from 'react-router-dom';
const MyNavlink = (props) => {
    return (
        <NavLink activeClassName='nav-active' {...props}></NavLink>
    );
};

export default MyNavlink;