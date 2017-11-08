import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
import { Numeral } from '../ast/Numeral';

/**
  Representación de multiplicaciones.
*/
export class Division implements Exp {

  lhs: Exp;
  rhs: Exp;

  constructor(lhs: Exp, rhs: Exp) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(): string {
    return `Division(${this.lhs.toString()}, ${this.rhs.toString()})`;
  }

  unparse(): string {
    return `(${this.lhs.unparse()} / ${this.rhs.unparse()})`;
  }

  optimization(state:State){
    var lhsOpt = this.lhs.optimization(state);
    var rhsOpt = this.rhs.optimization(state);
    if((rhsOpt as Numeral).value == 1){
      return lhsOpt;
    } else if ((rhsOpt as Numeral).value == 0){
      return new Numeral(0);
    } else if ((rhsOpt as Numeral).value == (lhsOpt as Numeral).value){
      return new Numeral(1);
    }
    return new Division(lhsOpt,rhsOpt);
  }

  compileCIL(context: CompilationContext): CompilationContext {
    context = this.lhs.compileCIL(context);
    context = this.rhs.compileCIL(context);
    context.appendInstruction("div");
    return context;
  }

  maxStackIL(value: number): number {
    return value - 1;
  }
}
