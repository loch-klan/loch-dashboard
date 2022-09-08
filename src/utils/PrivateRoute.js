import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { getToken } from "./ManageToken";
// import { Sidenav, Navbar } from '../app/common'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      // ON EVERY ROUTE GET PARAMS FROM URL AND SET TO LOCAL STORAGE.
      // const scope = {};
      // scope.account_id = props.match.params.accountId ? parseInt(props.match.params.accountId, 10) : 0;
      // scope.project_id = props.match.params.projectId ? parseInt(props.match.params.projectId, 10) : 0;
      // scope.department_id = props.match.params.departmentId ? parseInt(props.match.params.departmentId, 10) : 0;
      // localStorage.setItem('scope', JSON.stringify(scope));

      return requireAuth() ?
        (
          // key ADDED TO MAKE EVERY ROUTE WITH DIFFERENT PARAMS ID UNIQUE AND CALL DID MOUNT
          // WHEN PARAM ID CHANGES.
          <div className='main-section'>
            {/* {
              props.location.pathname !== "home"
              ?
              {/* <Sidenav {...props} />
              :
              null
            } */}
            <div className='main-section-right'>
              <div className='main-content-wrapper'>
                <Component key={props.location.pathname} {...props} />
              </div>

            </div>
          </div>

        )
        :
        (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location }
            }}
          />
        )
    }
    }
  />
);

const requireAuth = () => {
  const token = getToken();
  return token;
}

export default PrivateRoute;