import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
import { Numeral } from '../ast/Numeral';
/**
  Representación de restas.
*/
export class Substraction implements Exp {

  lhs: Exp;
  rhs: Exp;

  constructor(lhs: Exp, rhs: Exp) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(): string {
    return `Substraction(${this.lhs.toString()}, ${this.rhs.toString()})`;
  }

  unparse(): string {
    return `(${this.lhs.unparse()} - ${this.rhs.unparse()})`;
  }

  optimization(state:State){
    let lhsOpt = this.lhs.optimization(state);
    let rhsOpt = this.rhs.optimization(state);
    if((lhsOpt as Numeral).value == 0){
      return new Numeral(-rhsOpt.value);
    } else if((rhsOpt as Numeral).value == 0){
      return lhsOpt;
    } else if(lhsOpt instanceof Numeral && rhsOpt instanceof Numeral){
      return new Numeral(lhsOpt.value-rhsOpt.value);
    }
    return new Substraction(lhsOpt,rhsOpt);
  }

  compileCIL(context: CompilationContext): CompilationContext {
    return undefined;
  }

  maxStackIL(value: number): number {
    return value - 1;
  }
}
