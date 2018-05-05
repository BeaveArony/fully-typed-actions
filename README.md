# Fully Typed Actions

Helpers for fully typed redux action creators with Typescript >=v2.8. Also features an Epic ofType rxjs operator.

This package is heavily inspired from Martin Hochel and the code is taken from his article: 
[Improved Redux type safety with TypeScript 2.8](https://medium.com/@martin_hotell/improved-redux-type-safety-with-typescript-2-8-2c11a8062575)

## Getting Started

Install `fully-typed-actions`:

```bash
npm install fully-typed-actions
```

```bash
yarn add fully-typed-actions
```

## Usage In Actions

```ts
import { ActionsUnion, createAction } from 'fully-typed-actions';

export const SET_AGE = '[core] set age';
export const SET_NAME = '[core] set name';
export const RELOAD_URL = '[router] Reload Page';

export const Actions = {
  setAge: (age: number) => createAction(SET_AGE, age),
  setName: (name: string) => createAction(SET_NAME, name),
  reloadUrl: () => createAction(RELOAD_URL),
};

export type Actions = ActionsUnion<typeof Actions>;
```

## Usage In Reducers

```ts
import * as fromActions from './actions'

export interface State {
  user: { age: number; name: string } | {}
  reloadPage: boolean
}
export const initialState: State = {
  user: {},
  reloadPage: false,
}
export const reducer = (state = initialState, action: fromActions.Actions): State => {
  switch (action.type) {
    case fromActions.SET_AGE: {
      const { payload: newAge } = action
      state.user
      const newUser = { ...state.user, age: newAge }
      const newState = { ...state, user: newUser }
      return newState
    }

    case fromActions.SET_NAME: {
      const { payload: newName } = action
      const newUser = { ...state.user, age: newName }
      const newState = { ...state, user: newUser }
      return newState
    }

    case fromActions.RELOAD_URL: {
      // const { type } = action
      // const { payload } = action // ERROR
      return {
        ...state,
        reloadPage: true,
      }
    }

    default:
      return state
  }
}
```

## Usage In Epics with special ofType operator

```ts
import { Epic } from 'redux-observable';
import { map } from 'rxjs/operators';

import { ofType, ActionsOfType } from 'fully-typed-actions';

import { SET_AGE, actions, Actions } from './actions';
import { State } from './store';

// BEHOLD 100% type safe epic ! I ❤️ it !
const epic: Epic<Actions, State> = actions$ => {
  return actions$.pipe(
    ofType(SET_AGE),
    map(action => {
      const { type, payload: newAge } = action;
      return actions.reloadUrl();
    })
  );
};
```

## Usage In Epics with normal ofType operator from redux-observable

```ts
import { Epic, ofType } from 'redux-observable';
import { map } from 'rxjs/operators';

import { ActionsOfType } from 'fully-typed-actions';

import { SET_AGE, actions, Actions } from './actions';
import { State } from './store';

// Extract the action type from the ActionsUnion type
type SetAgeAction = ActionsOfType<Actions, typeof SET_AGE>

const epic: Epic<Actions, State> = actions$ => {
  return actions$.pipe(
    ofType<Actions, SetAgeAction>(SET_AGE),
    map(action => {
      const { type, payload: newAge } = action
      return Actions.reloadUrl()
    })
  )
}

const epicWithChainOfType: Epic<Actions, State> = actions$ => {
  return actions$.ofType<SetAgeAction>(SET_AGE).pipe(
    map(action => {
      const { type, payload: newAge } = action
      return Actions.reloadUrl()
    })
  )
```
