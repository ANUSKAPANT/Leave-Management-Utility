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
import React, { useContext } from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle, Navbar, Nav, Container, Media,
} from "reactstrap";
import axios from 'axios';
import Store from '../../Store';

const  avatar = require('argon-dashboard/assets/img/avatar');

interface Props {
  brandText: string;
}

const AdminNavbar:React.FC<Props> = ({ brandText }) => {
  const { globalState } = useContext(Store);
  const fullName = globalState.userData.first_name + " " + globalState.userData.last_name;

  const handleLogout = () => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute('content');
    axios({
      method: 'delete',
      url: '/users/sign_out',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrf,
      },
    }).then(() => {
      window.location.href = '/users/sign_in';
    });
  };

  return (
    <>
      <Navbar className="navbar-top navbar-dark pr-5 bg-primary" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-inline-block"
            to={`/admin/${brandText.toLowerCase()}`}
          >
            {brandText}
          </Link>
          <Nav className="align-items-center d-none d-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={avatar}
                    />
                  </span>
                  <Media className="ml-2 d-none d-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {fullName}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow right">
                <DropdownItem onClick={() => handleLogout()}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
