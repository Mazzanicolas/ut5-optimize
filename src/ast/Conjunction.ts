import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
import { TruthValue } from '../ast/TruthValue';

/**
  Representación de conjunciones booleanas (AND).
*/
export class Conjunction implements Exp {

  lhs: Exp;
  rhs: Exp;

  constructor(lhs: Exp, rhs: Exp) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(): string {
    return `Conjunction(${this.lhs.toString()}, ${this.rhs.toString()})`;
  }

  unparse(): string {
    return `(${this.lhs.unparse()} && ${this.rhs.unparse()})`;
  }

  optimization(state:State){
    let lhsOpt = this.lhs.optimization(state);
    let rhsOpt = this.rhs.optimization(state);
    if((lhsOpt as TruthValue).value == true){
      return rhsOpt;
    } else if((rhsOpt as TruthValue).value == true){
      return lhsOpt;
    } else if ((rhsOpt as TruthValue).value == false || (lhsOpt as TruthValue).value == false){
      return new TruthValue(false);
    }
    return new Conjunction(lhsOpt,rhsOpt);
  }

  compileCIL(context: CompilationContext): CompilationContext {
    context = this.rhs.compileCIL(context);
    context = this.lhs.compileCIL(context);
    context.appendInstruction("and");
    return context;
  }

  maxStackIL(value: number): number {
    return value - 1;
  }
}
