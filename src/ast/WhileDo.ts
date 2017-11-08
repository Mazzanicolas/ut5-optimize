import { Exp, Stmt } from './ASTNode';
import { CompilationContext } from '../compileCIL/CompilationContext';
import { State } from '../State/State';
import { TruthValue } from '../ast/TruthValue';
/**
  Representación de las iteraciones while-do.
*/
export class WhileDo implements Stmt {
  cond: Exp;
  body: Stmt;

  constructor(cond: Exp, body: Stmt) {
    this.cond = cond;
    this.body = body;
  }

  toString(): string {
    return `WhileDo(${this.cond.toString()}, ${this.body.toString()})`;
  }

  unparse(): string {
    return `while ${this.cond.unparse()} do { ${this.body.unparse()} }`;
  }

  optimization(state:State){
    let cnd = this.cond.optimization(state);
    let bdy = this.cond.optimization(state);
    if(cnd instanceof TruthValue){
      if(!cnd.value){
        return;
      }
    }
    return new WhileDo(cnd,bdy);
  }
  compileCIL(context: CompilationContext): CompilationContext {
    return undefined;
  }

  maxStackIL(value: number): number {
    const maxStackILBody = this.body.maxStackIL(value);
    return 1 + maxStackILBody; // cond + body
  }
}
