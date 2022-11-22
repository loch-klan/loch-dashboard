import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import Sidebar from '../app/common/Sidebar';
import { getToken } from "./ManageToken";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      // ON EVERY ROUTE GET PARAMS FROM URL AND SET TO LOCAL STORAGE.
      return requireAuth() ?
        (
          // key ADDED TO MAKE EVERY ROUTE WITH DIFFERENT PARAMS ID UNIQUE AND CALL DID MOUNT
          // WHEN PARAM ID CHANGES.
          <div className='main-section'>
            {
              props.location.pathname !== "/home"
              ?
              <Sidebar ownerName={""} {...props} />
              :
              null
            }
            <div className={`main-section-right ${props.location.pathname !== "/home" ? "m-l-27" : ""}`}>
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