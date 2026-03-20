import type EllementComponent from "./EllementComponent";

class EllementRuntime {
  #stack: EllementComponent[] = [];
  #hookIndex = 0;

  begin(component: EllementComponent) {
    console.log("Begin render:", component.constructor.name);
    this.#stack.push(component);
    this.#hookIndex = 0;
  }

  end() {
    console.log("End render:", this.#stack[this.#stack.length - 1]?.constructor.name);

    this.#stack.pop();
    this.#hookIndex = 0;
  }

  getEllement() {
    console.log("Get ellement:", this.#stack[this.#stack.length - 1]?.constructor.name);
    const current = this.#stack[this.#stack.length - 1];
    if (!current) throw new Error("Hook llamado fuera de un componente");
    return current;
  }

  nextHookIndex() {
    console.log("Next hook index:", this.#hookIndex);
    return this.#hookIndex++;
  }
}

export default new EllementRuntime();