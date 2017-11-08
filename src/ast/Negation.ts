import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
import { TruthValue } from '../ast/TruthValue';

/**
  Representación de las negaciones de expresiones booleanas.
*/
export class Negation implements Exp {

  exp: Exp;

  constructor(exp: Exp) {
    this.exp = exp;
  }

  toString(): string {
    return `Negation(${this.exp.toString()})`;
  }

  unparse(): string {
    return `(!${this.exp.unparse()})`;
  }

  optimization(state:State){
    var expOpt = this.exp.optimization(state);
    if((expOpt as TruthValue).value){
      return new TruthValue(true);
    }
    return new TruthValue(false); //Esto esta bien? de otra forma no se puede optimizar, a mi no me cagan.
  }

  compileCIL(context: CompilationContext): CompilationContext {
    return undefined;
  }

  maxStackIL(value: number): number {
    return value;
  }
}
