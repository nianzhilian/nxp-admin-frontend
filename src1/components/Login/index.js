/*
 * @Author: your name
 * @Date: 2020-12-28 10:12:08
 * @LastEditTime: 2020-12-28 10:23:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webpack-base-config\src\components\Login\index.js
 */
import React, { PureComponent } from 'react'


export default class extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <form>
                <div>
                    <label>账号:</label>
                    <input type="text"  />
                </div>
                <div>
                    <label>密码:</label>
                    <input type="password" />
                </div>
                <div>
                    <button>登陆</button>
                </div>
            </form>
        )
    }
}
