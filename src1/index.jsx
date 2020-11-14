/*
 * @Author: your name
 * @Date: 2020-12-16 10:31:02
 * @LastEditTime: 2020-12-28 10:09:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webpack-base-config\src\index.jsx
 */
import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const root = (
    <BrowserRouter basename="/">
        <App />
    </BrowserRouter>
)

ReactDOM.render(root,document.getElementById('root'))

