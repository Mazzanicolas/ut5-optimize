import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
import { TruthValue } from '../ast/TruthValue';
import { Numeral } from '../ast/Numeral';

/**
  Representación de las comparaciones por menor o igual.
*/
export class CompareGreat implements Exp {

  lhs: Exp;
  rhs: Exp;

  constructor(lhs: Exp, rhs: Exp) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(): string {
    return `CompareGreat(${this.lhs.toString()}, ${this.rhs.toString()})`;
  }

  unparse(): string {
    return `(${this.lhs.unparse()} > ${this.rhs.unparse()})`;
  }

  optimization(state:State){
    var lhsOpt = this.lhs.optimization(state);
    var rhsOpt = this.rhs.optimization(state);
    if(lhsOpt instanceof Numeral && rhsOpt instanceof Numeral || lhsOpt instanceof TruthValue && rhsOpt instanceof TruthValue){
      return new TruthValue(lhsOpt.value>rhsOpt.value);
    }
    return new CompareGreat(lhsOpt,rhsOpt);
  }

  compileCIL(context: CompilationContext): CompilationContext {
    context = this.lhs.compileCIL(context);
    context = this.rhs.compileCIL(context);
    context.appendInstruction("cgt");
    return context;
  }

  maxStackIL(value: number): number {
    return value - 1;
  }
}
