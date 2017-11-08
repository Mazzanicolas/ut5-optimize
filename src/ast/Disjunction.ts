import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
import { TruthValue } from '../ast/TruthValue';
import { Numeral } from '../ast/Numeral';

/**
  Representación de conjunciones booleanas (AND).
*/
export class Disjunction implements Exp {

  lhs: Exp;
  rhs: Exp;

  constructor(lhs: Exp, rhs: Exp) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(): string {
    return `Disjunction(${this.lhs.toString()}, ${this.rhs.toString()})`;
  }

  unparse(): string {
    return `(${this.lhs.unparse()} || ${this.rhs.unparse()})`;
  }

  optimization(state:State){
    let lhsOpt = this.lhs.optimization(state);
    let rhsOpt = this.rhs.optimization(state);
    if((lhsOpt as TruthValue).value == true){
      return new TruthValue(true);;
    } else if((rhsOpt as TruthValue).value == true){
      return new TruthValue(true);;
    } else if ((rhsOpt as TruthValue).value == true || (lhsOpt as TruthValue).value == true){
      return new TruthValue(true);
    }
    return new Disjunction(lhsOpt,rhsOpt);
  }

  compileCIL(context: CompilationContext): CompilationContext {
    context = this.lhs.compileCIL(context);
    context = this.rhs.compileCIL(context);
    context.appendInstruction("or");
    return context;
  }

  maxStackIL(value: number): number {
    return value - 1;
  }
}
