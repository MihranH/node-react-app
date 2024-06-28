import { call, put, takeLatest } from 'redux-saga/effects';
import { actionTypes, getUserSuccess } from '../actions/auth';
import Auth from '../../api/auth';

function* getUser(action) {
  try {
    const user = yield call(Auth.getUser);
    yield put(getUserSuccess(user));
    action.callback(user);
  } catch (error) {
    console.log(error);
    action.callback(null);
  }
}

function* register(action) {
  try {
    const result = yield call(() => Auth.register(action.payload));
    action.callback(result);
  } catch (error) {
    console.log(error);
    action.callback(error?.response?.data?.message);
  }
}

function* login(action) {
  try {
    const result = yield call(() => Auth.login(action.payload));
    localStorage.setItem('token', result.token);
    yield put(getUserSuccess(result.clientUser));
    action.callback(true);
  } catch (error) {
    console.log(error);
    action.callback(error?.response?.data?.message);
  }
}

function* logout(action) {
  try {
    localStorage.removeItem('token');
    yield put(getUserSuccess({}));
    action.callback(true);
  } catch (error) {
    console.log(error);
    action.callback(error?.response?.data?.message);
  }
}

function* upload(action) {
  try {
    yield call(() => Auth.upload(action.payload));
    action.callback(true);
  } catch (error) {
    console.log(error);
    action.callback(error?.response?.data?.message);
  }
}

export default function* authSaga() {
  yield takeLatest(actionTypes.GET_USER, getUser);
  yield takeLatest(actionTypes.REGISTER_USER, register);
  yield takeLatest(actionTypes.LOGIN_USER, login);
  yield takeLatest(actionTypes.LOGOUT, logout);
  yield takeLatest(actionTypes.UPLOAD, upload);
}
