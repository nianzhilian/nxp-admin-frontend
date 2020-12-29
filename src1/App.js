import React, { Suspense, PureComponent } from "react";
import { Route, Link, Switch, Redirect } from "react-router-dom";
const Login = React.lazy(() => import("./components/Login/index"));
const Layout = React.lazy(() => import("./components/Layout/index"));
const Home = React.lazy(() => import("./components/Home/index"));
const NoPage = React.lazy(() => import("./components/NoPage/index"));
const Sys = () => <div>系统管理</div>;
const isAuth = () => {
  let token = localStorage.getItem("token");
  return token ? true : false;
};

const routes = [
  {
    path: "/home",
    name: "首页",
    component: Layout,
    redirect: "/home/index",
    isAuth: isAuth(),
    exact: false,
    children: [
      {
        path: "/index",
        component: Home,
        hidden: true,
      },
      {
        path: "/sys",
        component: Sys,
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    redirect: "/home/index",
    isAuth: isAuth(),
    exact: true,
  },
  {
    path: "/login",
    component: Login,
    hidden: true,
    exact: true,
  },
  {
    path: "*",
    component: NoPage,
    hidden:true
  },
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
                exact={item.exact}
                render={(routerProps) => {
                  if (item.isAuth) {
                    if (item.children) {
                      let location = routerProps.location;
                      let isMatch = item.children.find((obj) => {
                        return item.path + obj.path == location.pathname;
                      });
                      if (isMatch) {
                        return (
                          <item.component {...routerProps}>
                            <Switch>
                              {item.children.map((route, j) => {
                                return (
                                  <Route
                                    path={item.path + route.path}
                                    key={j}
                                    exact={route.exact}
                                    component={(childRoutes) => {
                                      return <route.component />;
                                    }}
                                  />
                                );
                              })}
                            </Switch>
                          </item.component>
                        );
                      } else {
                        return <Route path="*" component={NoPage} />;
                      }
                    } else {
                      return <Redirect to={item.redirect} />;
                    }
                  } else {
                    if (item.hidden) {
                      return <item.component />;
                    }
                    return (
                      <Redirect
                        to={{
                          pathname: "/login",
                          state: { from: routerProps.location },
                        }}
                      />
                    );
                  }
                }}
              />
            );
          })}
        </Switch>
      </Suspense>
    );
  }
}

export default App;
