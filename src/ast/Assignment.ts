import { Exp, Stmt } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
import { Numeral } from '../ast/Numeral';
import { TruthValue } from '../ast/TruthValue';
/**
  Representación de las asignaciones de valores a variables.
*/
export class Assignment implements Stmt {

  id: string;
  exp: Exp;

  constructor(id: string, exp: Exp) {
    this.id = id;
    this.exp = exp;
  }

  toString(): string {
    return `Assignment(${this.id}, ${this.exp.toString()})`;
  }

  unparse(): string {
    return `${this.id} = ${this.exp.unparse()}`;
  }
  optimization(state:State){
    let ex = this.exp.optimization(state);
    if (ex instanceof Numeral || ex instanceof TruthValue){
      state.set(this.id,ex);//ex.value?
    } else {
      state.remove(this.id);
    }
    return new Assignment(this.id,ex);
  }
  compileCIL(context: CompilationContext): CompilationContext {
    context = this.exp.compileCIL(context);
    var v = context.getVar(this.id);
    if (v == -1){
        v = context.addVar(this.id,"int32");
    }
    context.appendInstruction("stloc " + v);
    return context;
  }

  maxStackIL(value: number): number {
    return this.exp.maxStackIL(value);
  }
}
