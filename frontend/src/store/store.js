import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from '@redux-devtools/extension';
import reducers from './reducers';
import sagas from './sagas';

const saga = createSagaMiddleware();
const store = createStore(reducers, composeWithDevTools(applyMiddleware(saga)));
saga.run(sagas);

export default store;
