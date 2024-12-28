"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
function activate(context) {
    let lastClickTime = 0;
    let lastClickPosition = null;
    let decorationType = vscode.window.createTextEditorDecorationType({
        textDecoration: 'underline'
    });
    let activeEditor = vscode.window.activeTextEditor;
    // 更新括号装饰
    function updateBracketDecorations() {
        if (!activeEditor)
            return;
        const text = activeEditor.document.getText();
        const brackets = [];
        const regex = /[\{\}\[\]]/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
            const startPos = activeEditor.document.positionAt(match.index);
            const endPos = activeEditor.document.positionAt(match.index + 1);
            brackets.push(new vscode.Range(startPos, endPos));
        }
        activeEditor.setDecorations(decorationType, brackets);
    }
    // 监听编辑器变化
    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            updateBracketDecorations();
        }
    }, null, context.subscriptions);
    // 监听文档变化
    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            updateBracketDecorations();
        }
    }, null, context.subscriptions);
    // 如果已经有活动的编辑器，立即更新装饰
    if (activeEditor) {
        updateBracketDecorations();
    }
    // 查找匹配的括号位置
    function findMatchingBracket(document, position) {
        const text = document.getText();
        const offset = document.offsetAt(position);
        const char = text[offset];
        // 确定搜索方向和匹配字符
        let isForward = true;
        let startChar = char;
        let endChar = '';
        if (char === '{')
            endChar = '}';
        else if (char === '[')
            endChar = ']';
        else if (char === '}') {
            endChar = '{';
            isForward = false;
        }
        else if (char === ']') {
            endChar = '[';
            isForward = false;
        }
        else
            return null;
        let count = 1;
        let currentOffset = offset;
        if (isForward) {
            while (++currentOffset < text.length) {
                if (text[currentOffset] === startChar)
                    count++;
                else if (text[currentOffset] === endChar) {
                    count--;
                    if (count === 0) {
                        return document.positionAt(currentOffset);
                    }
                }
            }
        }
        else {
            while (--currentOffset >= 0) {
                if (text[currentOffset] === startChar)
                    count++;
                else if (text[currentOffset] === endChar) {
                    count--;
                    if (count === 0) {
                        return document.positionAt(currentOffset);
                    }
                }
            }
        }
        return null;
    }
    // 获取括号位置（包括周围空格）
    function getBracketPosition(document, position) {
        const line = document.lineAt(position.line);
        const lineText = line.text;
        const char = lineText.charAt(position.character);
        // 检查当前字符和周围的字符
        if (/[\{\}\[\]]/.test(char)) {
            return position;
        }
        // 检查左边的字符（包括空格）
        let leftPos = position.character;
        while (leftPos > 0) {
            leftPos--;
            const leftChar = lineText.charAt(leftPos);
            if (/[\{\}\[\]]/.test(leftChar)) {
                return new vscode.Position(position.line, leftPos);
            }
            if (!/\s/.test(leftChar))
                break;
        }
        // 检查右边的字符（包括空格）
        let rightPos = position.character;
        while (rightPos < lineText.length - 1) {
            rightPos++;
            const rightChar = lineText.charAt(rightPos);
            if (/[\{\}\[\]]/.test(rightChar)) {
                return new vscode.Position(position.line, rightPos);
            }
            if (!/\s/.test(rightChar))
                break;
        }
        return null;
    }
    // 监听编辑器中的选择变化事件
    let selectionChangeDisposable = vscode.window.onDidChangeTextEditorSelection(async (e) => {
        const editor = e.textEditor;
        if (!editor)
            return;
        const currentTime = Date.now();
        const position = editor.selection.active;
        const document = editor.document;
        // 检查是否是双击事件
        const isSamePosition = lastClickPosition &&
            position.line === lastClickPosition.line &&
            Math.abs(position.character - lastClickPosition.character) <= 1;
        if (currentTime - lastClickTime < 500 && isSamePosition) {
            // 获取实际的括号位置
            const bracketPosition = getBracketPosition(document, position);
            if (bracketPosition) {
                // 查找匹配的括号
                const matchingPosition = findMatchingBracket(document, bracketPosition);
                if (matchingPosition) {
                    // 确定选择的起始和结束位置
                    const [startPos, endPos] = bracketPosition.isBefore(matchingPosition)
                        ? [bracketPosition, matchingPosition]
                        : [matchingPosition, bracketPosition];
                    // 创建选择范围（包括括号内的所有内容）
                    const selection = new vscode.Selection(startPos.translate(0, 1), // 从开始括号后一个字符开始
                    endPos // 到结束括号
                    );
                    editor.selection = selection;
                }
            }
        }
        lastClickTime = currentTime;
        lastClickPosition = position;
    });
    context.subscriptions.push(selectionChangeDisposable);
}
function deactivate() {
    // 清理装饰
    if (vscode.window.activeTextEditor) {
        vscode.window.activeTextEditor.setDecorations(vscode.window.createTextEditorDecorationType({}), []);
    }
}
//# sourceMappingURL=extension.js.map