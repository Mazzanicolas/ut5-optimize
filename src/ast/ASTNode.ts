import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
export interface ASTNode {
  toString(): string;
  unparse(): string;
}

/**
  Categoría sintáctica de las expresiones de While, las
  construcciones del lenguaje que evalúan a un valor.
*/
export interface Exp extends ASTNode {

  compileCIL(context: CompilationContext): CompilationContext;
  maxStackIL(value: number): number;
  optimization(state:State);

}

/**
  Categoría sintáctica de las sentencias (statements) de While, las
  construcciones del lenguaje que modifican (potencialmente) los
  valores de las variables en el estado del programa.
*/
export interface Stmt extends ASTNode {
  optimization(state:State);
  compileCIL(context: CompilationContext): CompilationContext;
  maxStackIL(value: number): number;

}
