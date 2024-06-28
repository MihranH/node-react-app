import { all, spawn } from 'redux-saga/effects';
import authSaga from './auth';

export default function* sagas() {
  yield all([spawn(authSaga)]);
}
