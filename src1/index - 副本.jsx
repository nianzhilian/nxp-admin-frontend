import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';

const styles = {
    active: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: 'white',
      height: 48,
      padding: '0 30px',
    },
  };

let ListItem = (props)=>{
    let {to,classes,children,...rest} = props
    return (
        <Route path={to} children={({match})=>{
            return (
                <li className={match?classes.active:''}>
                    <Link to={to} {...rest}>{children}</Link>
                </li>
            )
        }} />
    )
}
ListItem = withStyles(styles)(ListItem)
const App = ()=>(
    <Router>
        <ul>
            <ListItem to="/home">首页</ListItem>
            <ListItem to="/about">联系我们</ListItem>
        </ul>
        <Switch>
            <Route path="/home">
                <h2>首页的内容</h2>
            </Route>
            <Route path="/about">
                <h2>关于我们</h2>
            </Route>
            <Redirect to="/home" />
        </Switch>
    </Router>
)

ReactDOM.render(<App />,document.getElementById('root'))