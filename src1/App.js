
import React, { Suspense, PureComponent } from "react";
import { Route, Link, Switch, Redirect } from "react-router-dom";
const Login = React.lazy(() => import("./components/Login/index"));
const Layout = React.lazy(() => import("./components/Layout/index"));
const Home = React.lazy(() => import("./components/Home/index"));
const NoPage = React.lazy(() => import("./components/NoPage/index"));
const isAuth = () => {
    let token = localStorage.getItem("token");
    // return token ? true : false;
    return true
};

const routes = [
    {
        path: "/login",
        component: Login,
        hidden: true,
    },
    {
        path: "/home",
        name: "首页",
        component: Layout,
        redirect: "/home/index",
        isAuth: isAuth(),
        children: [
            {
                path: "/home/index",
                component: Home
            },
        ],
    },
    {
        path:'/',
        component: Layout,
        redirect: "/home",
        isAuth: isAuth()
    }
      
];

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { token } = this.props;
        return (
            <Suspense fallback={<div>正在加载中</div>}>
                <Switch>
                    {routes.map((item, i) => {
                        return (
                            <Route
                                path={item.path}
                                key={i}
                                exact
                                render={(routerProps) => {
                                   
                                    if (item.isAuth) {
                                        alert(item.isAuth)
                                        console
                                        if (item.children) {
                                            return (
                                                <item.component {...routerProps}>
                                                    <Switch>
                                                        {item.children.map((route, j) => {
                                                            return (
                                                                <Route
                                                                    path={route.path}
                                                                    key={j}
                                                                    
                                                                    component={route.component}
                                                                />
                                                            );
                                                        })}
                                                        <Redirect from={item.path} to={item.redirect} />
                                                        
                                                    </Switch>
                                                </item.component>
                                            );
                                        }else{
                                            return <Redirect to={item.redirect} />
                                        }
                                    } else {
                                        if(item.hidden){
                                            return <item.component />;
                                        }
                                        return <Redirect to='login' />
                                        if (item.hidden) {
                                            alert('asdas')
                                            return <item.component />;
                                        } else {
                                            alert('111')
                                            // return (
                                            //     <Redirect
                                            //         to={{
                                            //             pathname: "/login",
                                            //             state: { from: routerProps.location },
                                            //         }}
                                            //     />
                                            // );
                                        }
                                    }
                                }}
                            />
                        );
                    })}
                    <Route component={NoPage} />
                </Switch>
            </Suspense>
        );
    }
}

export default App;
