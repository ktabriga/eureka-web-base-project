import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { reducer as formReducer } from 'redux-form'
import thunk from 'redux-thunk'
//import {loginReducer} from '../Lib/Login'
import {appWrapReducer} from '../lib/AppWrap'
import {createCrudReducer} from '../lib/CrudOnRest'

const enhancers = []
const middlewares = [thunk]
const initialState = {}

const crudReducer = createCrudReducer()

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const store = createStore(
  combineReducers({
    form: formReducer,
    appWrap: appWrapReducer,
    crud: crudReducer
  }),
  initialState,
  compose(applyMiddleware(...middlewares), ...enhancers)
)

export default store
