import { Exp, Stmt } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
import { TruthValue } from '../ast/TruthValue';

/**
  Representación de las sentencias condicionales.
*/
export class IfThenElse implements Stmt {
  cond: Exp;
  thenBody: Stmt;
  elseBody: Stmt;

  constructor(cond: Exp, thenBody: Stmt, elseBody: Stmt) {
    this.cond = cond;
    this.thenBody = thenBody;
    this.elseBody = elseBody;
  }

  toString(): string {
    return `IfThenElse(${this.cond.toString()}, ${this.thenBody.toString()}, ${this.elseBody.toString()})`;
  }

  unparse(): string {
    return `if ${this.cond.unparse()} then { ${this.thenBody.unparse()} } else { ${this.elseBody.unparse()} }`;
  }
  optimization(state:State){
    var state2 = state.clone();
    var state3 = state.clone();
    let condOpt = this.cond.optimization(state);
    let thenBodyOpt = this.thenBody.optimization(state2);
    let elseBodyOpt = this.elseBody.optimization(state3);
    if(condOpt instanceof TruthValue){
      if(condOpt.value){
        return thenBodyOpt;
      } else {
        return elseBodyOpt;
      }
    }
    state = state2.intersect(state3);
    return new IfThenElse(condOpt,thenBodyOpt,elseBodyOpt);
  }
  compileCIL(context: CompilationContext): CompilationContext {
    context  = this.cond.compileCIL(context);
    var tag  = context.getTag();
    var tag2 = context.getTag();
    context.appendInstruction("brfalse "+tag);
    context = this.thenBody.compileCIL(context);
    context.appendInstruction("br "+tag2);
    context.appendInstruction(tag);
    context = this.elseBody.compileCIL(context);
    context.appendInstruction(tag2)
    return context;
  }

  maxStackIL(value: number): number {
    const maxStackILThen = this.thenBody.maxStackIL(value);
    const maxStackILElse = this.elseBody.maxStackIL(value);
    return 1 + Math.max(maxStackILThen, maxStackILElse); // cond + max of the two branches
  }
}
