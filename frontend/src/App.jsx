import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import { getUser } from './store/actions/auth';
import { PRIVATE_PATHS } from './routes/data';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, []);

  const isLoggedIn = useSelector((state) => state.auth.user?.id);

  return (
    <BrowserRouter>
      <Routes>
        {PRIVATE_PATHS.map((route) => (
          <Route
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                {route.component}
              </PrivateRoute>
            }
            key={route.key}
            path={route.path}
          />
        ))}

        <Route
          element={
            <PublicRoute isLoggedIn={isLoggedIn}>
              <Login />
            </PublicRoute>
          }
          path='/login'
        />

        <Route
          element={
            <PublicRoute isLoggedIn={isLoggedIn}>
              <Register />
            </PublicRoute>
          }
          path='/register'
        />

        <Route path='*' element={<Navigate to='/profile' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
