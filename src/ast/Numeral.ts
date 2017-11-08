import { Exp } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
/**
  Representación de constantes numéricas o numerales.
*/
export class Numeral implements Exp {

  value: number;

  constructor(value: number) {
    this.value = value;
  }

  toString(): string {
    return `Numeral(${this.value})`;
  }

  unparse(): string {
    return `${this.value}`;
  }

  optimization(state:State){
    return this;
  }

  compileCIL(context: CompilationContext): CompilationContext {
    var hexValue = this.value.toString(16);
    context.appendInstruction("ldc.i4 " + hexValue);
    return context;
  }

  maxStackIL(value: number): number {
    return value + 1;
  }
}
