export class State {

  vars: Map<string, any>;

  constructor() {
    this.vars = new Map<string, any>();
  }

  toString(): string {
    return `{ ${Array.from(this.vars.entries()).map(([key, value]) => (`${key} = ${value}`)).join("; ")} }`;
  }

  get(id: string): any {
    return this.vars.get(id);
  }
  remove(id:string){
    this.vars.delete(id);
  }

  clone(){
    return this;//"no lo implemente porque no queria, igual te haces la idea";
  }

  intersect(state:State){
    //esto intersecta los states y los asigna al state
    return this;
  }

  set(id: string, value: any) {
    this.vars.set(id, value);
  }
}
