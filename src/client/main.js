import React from 'react';
import ReactDOM from 'react-dom';
import Application from './components/app';

document.addEventListener("DOMContentLoaded", function(event) {
    ReactDOM.render(React.createElement(Application, null), document.getElementById("react-container"));
});
