import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
import { TruthValue } from '../ast/TruthValue';
import { Numeral } from '../ast/Numeral';

/**
  Representación de las comparaciones por igual.
*/
export class CompareNotEqual implements Exp {

  lhs: Exp;
  rhs: Exp;

  constructor(lhs: Exp, rhs: Exp) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(): string {
    return `CompareNotEqual(${this.lhs.toString()}, ${this.rhs.toString()})`;
  }

  unparse(): string {
    return `(${this.lhs.unparse()} != ${this.rhs.unparse()})`;
  }

  optimization(state:State){
    var lhsOpt = this.lhs.optimization(state);
    var rhsOpt = this.rhs.optimization(state);
    if(lhsOpt instanceof Numeral && rhsOpt instanceof Numeral || lhsOpt instanceof TruthValue && rhsOpt instanceof TruthValue){
      return new TruthValue(lhsOpt.value!=rhsOpt.value);
    }
    return new CompareNotEqual(lhsOpt,rhsOpt);
  }

  compileCIL(context: CompilationContext): CompilationContext {
    context = this.rhs.compileCIL(context);
    context = this.lhs.compileCIL(context);
    context.appendInstruction("ceq");
    context.appendInstruction("neg");
    return context;
  }

  maxStackIL(value: number): number {
    return value - 1;
  }
}
