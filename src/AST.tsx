
export enum BinOperation { AND, OR, XOR }
export enum ExprType { BinApp , Not , Shift, Value }
export enum ShiftDirection { ShiftLeft , ShiftRight }

export type ShiftVal = -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export type Expr
    = { exprType: ExprType.BinApp, binOp: BinOperation,  expr1: Expr, expr2: Expr }
    | { exprType: ExprType.Not, expr: Expr }
    | { exprType: ExprType.Shift, expr: Expr, dir: ShiftDirection, shiftVal: ShiftVal }
    | { exprType: ExprType.Value, value: number }

export function VALUE_EXPR(x: number): Expr { return {exprType: ExprType.Value, value: x} }

export function prettyPrint(expr: Expr): string {
    switch (expr.exprType) {
    case ExprType.BinApp:
        const op = binOpToString(expr.binOp);
        const left = prettyPrint(expr.expr1);
        const right = prettyPrint(expr.expr2);
        return `(${left} ${op} ${right})`;

    case ExprType.Not:
        const notExpr = prettyPrint(expr.expr);
        return `~${notExpr}`;

    case ExprType.Shift:
        const shiftExpr = prettyPrint(expr.expr);
        const direction = shiftDirectionToString(expr.dir);
        const shiftVal = expr.shiftVal;
        return `(${shiftExpr} ${direction} ${shiftVal})`;

    case ExprType.Value:
        return expr.value.toString(2).padStart(8, '0');

    default:
        throw new Error('Invalid expression type');
    }
}

function binOpToString(binOp: BinOperation): string {
    switch (binOp) {
        case BinOperation.AND:
        return '&';
        case BinOperation.OR:
        return '|';
        case BinOperation.XOR:
        return '^';
        default:
        throw new Error('Invalid binary operation');
    }
}

function shiftDirectionToString(shiftDirection: ShiftDirection): string {
    switch (shiftDirection) {
        case ShiftDirection.ShiftLeft:
        return '<<';
        case ShiftDirection.ShiftRight:
        return '>>';
        default:
        throw new Error('Invalid shift direction');
    }
}

export function serializeToJS(expr: Expr): string {
    switch (expr.exprType) {
        case ExprType.BinApp:
            const op = binOpToJSOperator(expr.binOp);
            const left = serializeToJS(expr.expr1);
            const right = serializeToJS(expr.expr2);
            return `(${left} ${op} ${right})`;

        case ExprType.Not:
            const notExpr = serializeToJS(expr.expr);
            return `(~${notExpr})`;

        case ExprType.Shift:
            const shiftExpr = serializeToJS(expr.expr);
            const direction = shiftDirectionToJSOperator(expr.dir);
            const shiftVal = expr.shiftVal;
            return `(${shiftExpr} ${direction} ${shiftVal})`;

        case ExprType.Value:
            return expr.value.toString();

        default:
            throw new Error('Invalid expression type');
    }
}

function binOpToJSOperator(binOp: BinOperation): string {
    switch (binOp) {
        case BinOperation.AND:
            return '&';
        case BinOperation.OR:
            return '|';
        case BinOperation.XOR:
            return '^';
        default:
            throw new Error('Invalid binary operation');
    }
}

function shiftDirectionToJSOperator(shiftDirection: ShiftDirection): string {
    switch (shiftDirection) {
        case ShiftDirection.ShiftLeft:
            return '<<';
        case ShiftDirection.ShiftRight:
            return '>>';
        default:
            throw new Error('Invalid shift direction');
    }
}

export function evaluate(expr: Expr): number {
    switch (expr.exprType) {
        case ExprType.BinApp:
            const left = evaluate(expr.expr1);
            const right = evaluate(expr.expr2);
            switch (expr.binOp) {
                case BinOperation.AND:
                    return left & right;
                case BinOperation.OR:
                    return left | right;
                case BinOperation.XOR:
                    return left ^ right;
                default:
                    throw new Error('Invalid binary operation');
            }

        case ExprType.Not:
            const notExpr = evaluate(expr.expr);
            return ( ~notExpr >>> 0);

        case ExprType.Shift:
            const shiftExpr = evaluate(expr.expr);
            const shiftVal = expr.shiftVal;
            switch (expr.dir) {
                case ShiftDirection.ShiftLeft:
                    return shiftExpr << shiftVal;
                case ShiftDirection.ShiftRight:
                    return shiftExpr >> shiftVal;
                default:
                    throw new Error('Invalid shift direction');
            }

        case ExprType.Value:
            return expr.value;

        default:
            throw new Error('Invalid expression type');
    }
}
