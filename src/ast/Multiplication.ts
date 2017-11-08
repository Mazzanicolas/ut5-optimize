import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
import { Numeral } from '../ast/Numeral';

/**
  Representación de multiplicaciones.
*/
export class Multiplication implements Exp {

  lhs: Exp;
  rhs: Exp;

  constructor(lhs: Exp, rhs: Exp) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  toString(): string {
    return `Multiplication(${this.lhs.toString()}, ${this.rhs.toString()})`;
  }

  unparse(): string {
    return `(${this.lhs.unparse()} * ${this.rhs.unparse()})`;
  }

  optimization(state:State){
    let lhsOpt = this.lhs.optimization(state);
    let rhsOpt = this.rhs.optimization(state);
    if((lhsOpt as Numeral).value == 0 || (rhsOpt as Numeral).value == 0){
      return new Numeral(0);
    } else if ((lhsOpt as Numeral).value == 1){
      return rhsOpt;
    } else if ((rhsOpt as Numeral).value == 1){
      return lhsOpt;
    }
    return new Multiplication(lhsOpt,rhsOpt);
  }

  compileCIL(context: CompilationContext): CompilationContext {
    return undefined;
  }

  maxStackIL(value: number): number {
    return value - 1;
  }
}
