import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import auth from './auth'

export const ProtectedRoute = ({component: Component, ...rest}) => {

  // return a route with component passed in
  // check if user is logged in
  return (
    <Route
      {...rest}
      render={(props) => auth.isAuthenticated()
        ? <Component {...props} />
        : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
    />
  )
}