import { Stmt } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';

/**
  Representación de las secuencias de sentencias.
*/
export class Sequence implements Stmt {

  statements: [Stmt];

  constructor(statements: [Stmt]) {
    this.statements = statements;
  }

  toString(): string {
    const statements = this.statements
      .filter((stmt) => (stmt !== undefined))
      .map((stmt) => (stmt.toString()))
      .join(", ");
    return `Sequence(${statements})`
  }

  unparse(): string {
    const statements = this.statements
      .filter((stmt) => (stmt !== undefined))
      .map((stmt) => (stmt.toString()))
      .join(" ");
    return `{ ${statements} }`
  }

  optimization(state:State){
    for(var i=0; i<=this.statements.length; i++){
      this.statements[i].optimization(state);
    }
  }

  compileCIL(context: CompilationContext): CompilationContext {
    for(var i = 0; i < this.statements.length; i++){
      context = this.statements[i].compileCIL(context);
    }
    return context;
  }

  maxStackIL(value: number): number {
    for (let stmt of this.statements) {
      value = stmt.maxStackIL(value)
    }
    return value;
  }
}
