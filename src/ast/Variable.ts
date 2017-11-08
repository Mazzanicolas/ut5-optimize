import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
import { TruthValue } from '../ast/TruthValue';
import { Numeral } from '../ast/Numeral';
/**
  Representación de usos de variable en expresiones.
*/
export class Variable implements Exp {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  toString(): string {
    return `Variable(${this.id})`;
  }

  unparse(): string {
    return this.id;
  }

  optimization(state:State){
    var v = state.get(this.id);
    if(v instanceof TruthValue || v instanceof Numeral){
      return v;
    }
    return this;
  }

  compileCIL(context: CompilationContext): CompilationContext {
    var v = context.getVar(this.id);
    context.appendInstruction("ldloc " + v);
    return context;
  }

  maxStackIL(value: number): number {
    return value + 1;
  }
}
