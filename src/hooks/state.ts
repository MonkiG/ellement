import EllementRuntime from "../core/runtime";
import type EllementComponent from "../core/EllementComponent";

type HookHost = EllementComponent 

export function state<T>(initial: T) {
  const instance = EllementRuntime.getEllement() as HookHost;
  const hookIndex = EllementRuntime.nextHookIndex();

  if (instance._hooks[hookIndex] === undefined) {
    instance._hooks[hookIndex] = initial;
  }

  const setState = (next: T | ((prev: T) => T)) => {
    const prev = instance._hooks[hookIndex] as T;
    const value =
      typeof next === "function"
        ? (next as (prev: T) => T)(prev)
        : next;

    if (Object.is(prev, value)) return;

    instance._hooks[hookIndex] = value;
    instance.requestRender();
  };

  //TODO: Due the way we are handling the events in the EllementComponent class
  // we have to return a object
  return {
    value: instance._hooks[hookIndex] as T,
    set: setState,
  }
}