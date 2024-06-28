export const actionTypes = {
  GET_USER: 'GET_USER',
  GET_USER_SUCCESS: 'GET_USER_SUCCESS',
  LOGIN_USER: 'LOGIN_USER',
  LOGIN_USER_SUCCESS: 'LOGIN_USER_SUCCESS',
  REGISTER_USER: 'REGISTER_USER',
  LOGOUT: 'LOGOUT',
  UPLOAD: 'UPLOAD',
};

export const getUser = (callback = () => {}) => ({
  type: actionTypes.GET_USER,
  callback,
});

export const getUserSuccess = (data) => ({
  type: actionTypes.GET_USER_SUCCESS,
  payload: data,
});

export const login = (data, callback = () => {}) => ({
  type: actionTypes.LOGIN_USER,
  callback,
  payload: data,
});

export const loginSuccess = (data) => ({
  type: actionTypes.LOGIN_USER_SUCCESS,
  payload: data,
});

export const register = (data, callback = () => {}) => ({
  type: actionTypes.REGISTER_USER,
  callback,
  payload: data,
});

export const logout = (callback = () => {}) => ({
  type: actionTypes.LOGOUT,
  callback,
});

export const upload = (data, callback = () => {}) => ({
  type: actionTypes.UPLOAD,
  callback,
  payload: data,
});
