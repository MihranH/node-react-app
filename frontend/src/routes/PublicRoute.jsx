import { Navigate } from 'react-router-dom';

function PublicRoute({ component: Component, ...rest }) {
  const { isLoggedIn, children } = rest;

  return isLoggedIn ? <Navigate to='/profile' /> : children;
}
export default PublicRoute;
