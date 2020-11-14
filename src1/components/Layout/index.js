/*
 * @Author: your name
 * @Date: 2020-12-28 11:07:20
 * @LastEditTime: 2020-12-28 15:02:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webpack-base-config\src\components\Layout\index.js
 */
import React ,{Fragment}from 'react'

export default class extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        console.log(this.props)
        const {children} = this.props
        return (
            <>
            <div>
                头部
            </div>
            {children}
            <div>底部</div>
            </>
        )
    }
}