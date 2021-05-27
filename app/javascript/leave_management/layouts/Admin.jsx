/*!

=========================================================
* Argon Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect, useContext } from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "../components/Navbars/AdminNavbar";
import Footer from "../components/Footers/Footer";
import Store from '../Store';
import routes from "../routes.js";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const { globalState } = useContext(Store);
  const { userData } = globalState;

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = () => routes.map((prop, key) => {
    if (prop.layout === "/admin") {
      return (
        <Route
          path={prop.layout + prop.path}
          key={key}
          render={(props) => <prop.component userData={userData} {...props} />} 
        />
      );
    } else {
      return null;
    }
  });

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };


  return (
    <>
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(window.location.pathname)}
        />
         <Switch>
          {getRoutes(routes)}
        </Switch>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Admin;
