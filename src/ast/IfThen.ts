import { Exp, Stmt } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
import { TruthValue } from '../ast/TruthValue';
/**
  Representación de las sentencias condicionales.
*/
export class IfThen implements Stmt {
  cond: Exp;
  thenBody: Stmt;

  constructor(cond: Exp, thenBody: Stmt) {
    this.cond = cond;
    this.thenBody = thenBody;
  }

  toString(): string {
    return `IfThen(${this.cond.toString()}, ${this.thenBody.toString()})`;
  }

  unparse(): string {
    return `if ${this.cond.unparse()} then { ${this.thenBody.unparse()} }`;
  }

  optimization(state:State){
    var state2 = state.clone();
    let cnd = this.cond.optimization(state);
    let thBdy = this.thenBody.optimization(state2);
    if(cnd instanceof TruthValue){
      if(cnd.value){
        return thBdy;
      } else { return; }
    }
    state.intersect(state2);
    return new IfThen(cnd,thBdy);
  }

  compileCIL(context: CompilationContext): CompilationContext {
    context = this.cond.compileCIL(context);
    var tag = context.getTag();
    context.appendInstruction("brfalse " + tag)
    context = this.thenBody.compileCIL(context);
    context.appendInstruction(tag);
    return context;
  }

  maxStackIL(value: number): number {
    return Math.max(this.cond.maxStackIL(value),this.thenBody.maxStackIL(value));
  }
}
