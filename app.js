class ScientificCalculator {
    constructor() {
        this.display = document.getElementById('display');
        this.historyDisplay = document.getElementById('history');
        this.angleMode = document.getElementById('angleMode');
        this.memoryIndicator = document.getElementById('memoryIndicator');
        this.historyPanel = document.getElementById('historyPanel');
        this.historyContent = document.getElementById('historyContent');
        this.secondBtn = document.getElementById('secondBtn');
        
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.memory = 0;
        this.lastAnswer = 0;
        this.isRadianMode = false;
        this.isSecondMode = false;
        this.history = [];
        this.parenthesesCount = 0;
        
        this.updateDisplay();
        this.setupEventListeners();
        this.setupKeyboardListeners();
        this.triggerStartupAnimation();
    }

    setupEventListeners() {
        // Get all buttons and attach event listeners based on their content and class
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const text = button.textContent.trim();
                const classList = button.classList;
                
                // Handle different button types
                if (classList.contains('btn-number')) {
                    this.handleNumberButton(text);
                } else if (classList.contains('btn-operator')) {
                    this.handleOperatorButton(text);
                } else if (classList.contains('btn-function')) {
                    this.handleFunctionButton(text);
                } else if (classList.contains('btn-memory')) {
                    this.handleMemoryButton(text);
                } else if (classList.contains('btn-special')) {
                    this.handleSpecialButton(text);
                } else if (classList.contains('btn-equals')) {
                    this.calculate();
                }
            });
        });

        // Special event listeners for mode toggle
        if (this.angleMode) {
            this.angleMode.addEventListener('click', () => this.toggleAngleMode());
        }
    }

    handleNumberButton(text) {
        this.inputNumber(text);
    }

    handleOperatorButton(text) {
        switch (text) {
            case '+':
                this.inputOperator('+');
                break;
            case '-':
                this.inputOperator('-');
                break;
            case '×':
                this.inputOperator('*');
                break;
            case '÷':
                this.inputOperator('/');
                break;
        }
    }

    handleFunctionButton(text) {
        switch (text) {
            case 'sin':
                this.trigFunction('sin');
                break;
            case 'cos':
                this.trigFunction('cos');
                break;
            case 'tan':
                this.trigFunction('tan');
                break;
            case 'sin⁻¹':
                this.trigFunction('asin');
                break;
            case 'cos⁻¹':
                this.trigFunction('acos');
                break;
            case 'tan⁻¹':
                this.trigFunction('atan');
                break;
            case 'ln':
                this.mathFunction('ln');
                break;
            case 'log':
                this.mathFunction('log');
                break;
            case 'e^x':
                this.mathFunction('exp');
                break;
            case '√':
                this.mathFunction('sqrt');
                break;
            case 'x²':
                this.mathFunction('square');
                break;
            case 'x^y':
                this.mathFunction('power');
                break;
            case 'π':
                this.inputConstant('pi');
                break;
            case 'e':
                this.inputConstant('e');
                break;
            case 'x!':
                this.mathFunction('factorial');
                break;
            case '1/x':
                this.mathFunction('reciprocal');
                break;
            case '%':
                this.mathFunction('percent');
                break;
            case '±':
                this.toggleSign();
                break;
            case '10^x':
                this.mathFunction('pow10');
                break;
            case '|x|':
                this.mathFunction('abs');
                break;
            case '√y':
                this.mathFunction('nthroot');
                break;
        }
    }

    handleMemoryButton(text) {
        switch (text) {
            case 'MC':
                this.memoryClear();
                break;
            case 'MR':
                this.memoryRecall();
                break;
            case 'M+':
                this.memoryAdd();
                break;
            case 'M-':
                this.memorySubtract();
                break;
            case 'MS':
                this.memoryStore();
                break;
            case 'ANS':
                this.recallAnswer();
                break;
        }
    }

    handleSpecialButton(text) {
        switch (text) {
            case '2nd':
                this.toggleSecondMode();
                break;
            case 'MODE':
                this.toggleAngleMode();
                break;
            case 'DEL':
                this.backspace();
                break;
            case 'AC':
                this.clear();
                break;
            case 'HIST':
                this.showHistory();
                break;
            case '()':
                this.inputParentheses();
                break;
            case '(':
                this.openParenthesis();
                break;
            case ')':
                this.closeParenthesis();
                break;
            case 'CE':
                this.clearEntry();
                break;
            case '×':
                this.closeHistory();
                break;
            case 'Clear History':
                this.clearHistory();
                break;
        }
    }

    triggerStartupAnimation() {
        setTimeout(() => {
            const mainContainer = document.querySelector('.main-container');
            if (mainContainer) {
                mainContainer.classList.add('loaded');
            }
        }, 100);
    }

    setupKeyboardListeners() {
        document.addEventListener('keydown', (event) => {
            const key = event.key;
            
            if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
                event.preventDefault();
            }
            
            if ('0123456789'.includes(key)) {
                this.inputNumber(key);
            } else if (key === '+') {
                this.inputOperator('+');
            } else if (key === '-') {
                this.inputOperator('-');
            } else if (key === '*') {
                this.inputOperator('*');
            } else if (key === '/') {
                this.inputOperator('/');
            } else if (key === '.' || key === ',') {
                this.inputNumber('.');
            } else if (key === 'Enter' || key === '=') {
                this.calculate();
            } else if (key === 'Escape') {
                this.clear();
            } else if (key === 'Backspace') {
                this.backspace();
            }
        });
    }

    updateDisplay() {
        this.display.textContent = this.currentInput;
        this.updateMemoryIndicator();
    }

    updateMemoryIndicator() {
        this.memoryIndicator.textContent = this.memory !== 0 ? 'M' : '';
    }

    inputNumber(num) {
        if (this.waitingForOperand) {
            this.currentInput = num;
            this.waitingForOperand = false;
        } else {
            if (this.currentInput === '0' && num !== '.') {
                this.currentInput = num;
            } else {
                if (num === '.' && this.currentInput.includes('.')) {
                    return; // Prevent multiple decimal points
                }
                this.currentInput += num;
            }
        }
        this.updateDisplay();
    }

    inputConstant(constant) {
        let value;
        if (constant === 'pi') {
            value = Math.PI.toString();
        } else if (constant === 'e') {
            value = Math.E.toString();
        }
        
        this.currentInput = value;
        this.waitingForOperand = true;
        this.updateDisplay();
    }

    inputOperator(nextOperator) {
        const inputValue = parseFloat(this.currentInput);

        if (this.previousInput !== '' && this.operator && !this.waitingForOperand) {
            const result = this.performCalculation();
            if (result === null) return;
            
            this.currentInput = String(result);
            this.previousInput = this.currentInput;
        } else {
            this.previousInput = this.currentInput;
        }

        this.waitingForOperand = true;
        this.operator = nextOperator;
        
        let displayOperator = nextOperator;
        if (nextOperator === '*') displayOperator = '×';
        if (nextOperator === '/') displayOperator = '÷';
        
        this.historyDisplay.textContent = `${this.previousInput} ${displayOperator}`;
        this.updateDisplay();
    }

    performCalculation() {
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);

        if (isNaN(prev) || isNaN(current)) return null;

        let result;
        try {
            switch (this.operator) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        throw new Error('Division by zero');
                    }
                    result = prev / current;
                    break;
                case '^':
                    result = Math.pow(prev, current);
                    break;
                default:
                    return current;
            }

            if (!isFinite(result)) {
                throw new Error('Result is not finite');
            }

            return this.formatResult(result);
        } catch (error) {
            this.showError(error.message);
            return null;
        }
    }

    calculate() {
        if (this.operator && this.previousInput !== '' && !this.waitingForOperand) {
            let displayOperator = this.operator;
            if (this.operator === '*') displayOperator = '×';
            if (this.operator === '/') displayOperator = '÷';
            
            const expression = `${this.previousInput} ${displayOperator} ${this.currentInput}`;
            const result = this.performCalculation();
            
            if (result !== null) {
                this.addToHistory(expression, result);
                this.lastAnswer = result;
                this.currentInput = String(result);
                this.previousInput = '';
                this.operator = null;
                this.waitingForOperand = true;
                this.historyDisplay.textContent = '';
                this.updateDisplay();
            }
        }
    }

    trigFunction(func) {
        const value = parseFloat(this.currentInput);
        let angle = value;
        
        if (!this.isRadianMode && ['sin', 'cos', 'tan'].includes(func)) {
            angle = value * (Math.PI / 180); // Convert to radians
        }

        let result;
        let functionName = func;
        try {
            switch (func) {
                case 'sin':
                    result = Math.sin(angle);
                    break;
                case 'cos':
                    result = Math.cos(angle);
                    break;
                case 'tan':
                    result = Math.tan(angle);
                    break;
                case 'asin':
                    if (value < -1 || value > 1) throw new Error('Invalid input');
                    result = Math.asin(value);
                    if (!this.isRadianMode) result = result * (180 / Math.PI);
                    functionName = 'sin⁻¹';
                    break;
                case 'acos':
                    if (value < -1 || value > 1) throw new Error('Invalid input');
                    result = Math.acos(value);
                    if (!this.isRadianMode) result = result * (180 / Math.PI);
                    functionName = 'cos⁻¹';
                    break;
                case 'atan':
                    result = Math.atan(value);
                    if (!this.isRadianMode) result = result * (180 / Math.PI);
                    functionName = 'tan⁻¹';
                    break;
            }

            result = this.formatResult(result);
            this.addToHistory(`${functionName}(${value})`, result);
            this.lastAnswer = result;
            this.currentInput = String(result);
            this.waitingForOperand = true;
            this.updateDisplay();
        } catch (error) {
            this.showError('Math Error');
        }
    }

    mathFunction(func) {
        const value = parseFloat(this.currentInput);
        let result;
        let functionName = func;

        try {
            switch (func) {
                case 'sqrt':
                    if (value < 0) throw new Error('Invalid input');
                    result = Math.sqrt(value);
                    functionName = '√';
                    break;
                case 'square':
                    result = value * value;
                    functionName = 'x²';
                    break;
                case 'ln':
                    if (value <= 0) throw new Error('Invalid input');
                    result = Math.log(value);
                    break;
                case 'log':
                    if (value <= 0) throw new Error('Invalid input');
                    result = Math.log10(value);
                    break;
                case 'exp':
                    result = Math.exp(value);
                    functionName = 'e^x';
                    break;
                case 'pow10':
                    result = Math.pow(10, value);
                    functionName = '10^x';
                    break;
                case 'factorial':
                    if (value < 0 || !Number.isInteger(value) || value > 170) {
                        throw new Error('Invalid input');
                    }
                    result = this.factorial(value);
                    functionName = 'x!';
                    break;
                case 'reciprocal':
                    if (value === 0) throw new Error('Division by zero');
                    result = 1 / value;
                    functionName = '1/x';
                    break;
                case 'abs':
                    result = Math.abs(value);
                    functionName = '|x|';
                    break;
                case 'percent':
                    result = value / 100;
                    functionName = '%';
                    break;
                case 'power':
                    this.inputOperator('^');
                    return;
                case 'nthroot':
                    this.inputOperator('√');
                    return;
            }

            result = this.formatResult(result);
            this.addToHistory(`${functionName}(${value})`, result);
            this.lastAnswer = result;
            this.currentInput = String(result);
            this.waitingForOperand = true;
            this.updateDisplay();
        } catch (error) {
            this.showError('Math Error');
        }
    }

    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    toggleAngleMode() {
        this.isRadianMode = !this.isRadianMode;
        this.angleMode.textContent = this.isRadianMode ? 'RAD' : 'DEG';
    }

    toggleSecondMode() {
        this.isSecondMode = !this.isSecondMode;
        if (this.secondBtn) {
            if (this.isSecondMode) {
                this.secondBtn.classList.add('second-active');
            } else {
                this.secondBtn.classList.remove('second-active');
            }
        }
    }

    toggleSign() {
        if (this.currentInput !== '0' && this.currentInput !== 'Error') {
            if (this.currentInput.startsWith('-')) {
                this.currentInput = this.currentInput.slice(1);
            } else {
                this.currentInput = '-' + this.currentInput;
            }
            this.updateDisplay();
        }
    }

    inputParentheses() {
        // Smart parentheses - open if needed, close if possible
        const openCount = (this.currentInput.match(/\(/g) || []).length;
        const closeCount = (this.currentInput.match(/\)/g) || []).length;
        
        if (openCount > closeCount) {
            this.closeParenthesis();
        } else {
            this.openParenthesis();
        }
    }

    openParenthesis() {
        if (this.currentInput === '0' || this.waitingForOperand) {
            this.currentInput = '(';
        } else {
            this.currentInput += '*(';
        }
        this.parenthesesCount++;
        this.waitingForOperand = false;
        this.updateDisplay();
    }

    closeParenthesis() {
        if (this.parenthesesCount > 0) {
            this.currentInput += ')';
            this.parenthesesCount--;
            this.updateDisplay();
        }
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.historyDisplay.textContent = '';
        this.parenthesesCount = 0;
        this.updateDisplay();
    }

    clearEntry() {
        this.currentInput = '0';
        this.updateDisplay();
    }

    backspace() {
        if (this.currentInput !== 'Error') {
            if (this.currentInput.length > 1) {
                this.currentInput = this.currentInput.slice(0, -1);
            } else {
                this.currentInput = '0';
            }
            this.updateDisplay();
        }
    }

    // Memory Functions
    memoryStore() {
        this.memory = parseFloat(this.currentInput);
        this.updateMemoryIndicator();
    }

    memoryRecall() {
        this.currentInput = String(this.memory);
        this.waitingForOperand = true;
        this.updateDisplay();
    }

    memoryAdd() {
        this.memory += parseFloat(this.currentInput);
        this.updateMemoryIndicator();
    }

    memorySubtract() {
        this.memory -= parseFloat(this.currentInput);
        this.updateMemoryIndicator();
    }

    memoryClear() {
        this.memory = 0;
        this.updateMemoryIndicator();
    }

    recallAnswer() {
        this.currentInput = String(this.lastAnswer);
        this.waitingForOperand = true;
        this.updateDisplay();
    }

    // History Functions
    addToHistory(expression, result) {
        this.history.unshift({ expression, result, timestamp: new Date() });
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        if (this.history.length === 0) {
            this.historyContent.innerHTML = '<p class="no-history">No calculations yet</p>';
            return;
        }

        const historyHTML = this.history.map((item, index) => `
            <div class="history-item" data-index="${index}">
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
            </div>
        `).join('');

        this.historyContent.innerHTML = historyHTML;

        // Add click listeners to history items
        const historyItems = this.historyContent.querySelectorAll('.history-item');
        historyItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.selectHistoryItem(index);
            });
        });
    }

    selectHistoryItem(index) {
        const item = this.history[index];
        this.currentInput = String(item.result);
        this.waitingForOperand = true;
        this.updateDisplay();
        this.closeHistory();
    }

    showHistory() {
        this.historyPanel.classList.add('show');
        this.updateHistoryDisplay();
    }

    closeHistory() {
        this.historyPanel.classList.remove('show');
    }

    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
    }

    formatResult(result) {
        // Handle very small numbers (close to zero)
        if (Math.abs(result) < 1e-10) {
            return 0;
        }
        
        // Handle very large or very small numbers with scientific notation
        if (Math.abs(result) >= 1e10 || (Math.abs(result) < 1e-4 && result !== 0)) {
            return parseFloat(result.toExponential(8));
        }
        
        // For normal numbers, limit decimal places
        return Math.round(result * 1e10) / 1e10;
    }

    showError(message) {
        this.currentInput = 'Error';
        this.display.classList.add('error');
        setTimeout(() => {
            this.clear();
            this.display.classList.remove('error');
        }, 2000);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new ScientificCalculator();
});

// Handle window load for animation
window.addEventListener('load', () => {
    setTimeout(() => {
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.classList.add('loaded');
        }
    }, 100);
});