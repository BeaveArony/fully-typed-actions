export interface Action<T extends string> {
  type: T;
}

export interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P;
}

export type FunctionType = (...args: any[]) => any;
export type ActionCreatorsMapObject = { [actionCreator: string]: FunctionType };

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<
  A[keyof A]
>;
// conditional type for filtering actions in epics/effects
export type ActionsOfType<
  ActionUnion,
  ActionType extends string
> = ActionUnion extends Action<ActionType> ? ActionUnion : never;
