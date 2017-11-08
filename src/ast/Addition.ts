import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
import { Numeral } from '../ast/Numeral';
/**
  Representación de sumas.
*/
export class Addition implements Exp {

  lhs: Exp;
  rhs: Exp;

  constructor(lhs: Exp, rhs: Exp) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(): string {
    return `Addition(${this.lhs.toString()}, ${this.rhs.toString()})`;
  }

  unparse(): string {
    return `(${this.lhs.unparse()} + ${this.rhs.unparse()})`;
  }
  
  optimization(state:State){
    var lhsOpt = this.lhs.optimization(state);
    var rhsOpt = this.rhs.optimization(state);
    if((lhsOpt as Numeral).value == 0){
      return rhsOpt;
    } else if((rhsOpt as Numeral).value == 0){
      return lhsOpt;
    } else if(lhsOpt instanceof Numeral && rhsOpt instanceof Numeral){
      return new Numeral(lhsOpt.value+rhsOpt.value);
    }
    return new Addition(lhsOpt,rhsOpt);
  }

  compileCIL(context: CompilationContext): CompilationContext {
    context = this.lhs.compileCIL(context);
    context = this.rhs.compileCIL(context);
    context.appendInstruction("add");
    return context;
  }

  maxStackIL(value: number): number {
    return Math.max(this.lhs.maxStackIL(value),this.rhs.maxStackIL(value) + 1);
  }
}
