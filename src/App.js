import React from 'react';
import ReactFCCtest from 'react-fcctest';
import './App.css';

/* This is a component that renders all of the data entry buttons. */
const DataEntry = (props) => {
  return (
    <div id="entry">
      <div id="numbers">
        <button id="zero" value="0" onClick={(event) => {props.number(event)}}>0</button>
        <button id="one" value="1" onClick={(event) => {props.number(event)}}>1</button>
        <button id="two" value="2" onClick={(event) => {props.number(event)}}>2</button>
        <button id="three" value="3" onClick={(event) => {props.number(event)}}>3</button>
        <button id="four" value="4" onClick={(event) => {props.number(event)}}>4</button>
        <button id="five" value="5" onClick={(event) => {props.number(event)}}>5</button>
        <button id="six" value="6" onClick={(event) => {props.number(event)}}>6</button>
        <button id="seven" value="7" onClick={(event) => {props.number(event)}}>7</button>
        <button id="eight" value="8" onClick={(event) => {props.number(event)}}>8</button>
        <button id="nine" value="9" onClick={(event) => {props.number(event)}}>9</button>
        <button id="decimal" value="." onClick={(event) => {props.decimal(event)}}>.</button>
        <button />
      </div>
      <div id="operators">
        <button id="add" value="+" onClick={(event) => {props.operator(event)}}>+</button>
        <button id="subtract" value="-" onClick={(event) => {props.operator(event)}}>-</button>
        <button id="multiply" value="*" onClick={(event) => {props.operator(event)}}>x</button>
        <button id="divide" value="/" onClick={(event) => {props.operator(event)}}>/</button>
      </div>
    </div>
  );
};

/* This guy renders the equals sign. */
const Equals = (props) => {
  return(
  <button id="equals" onClick={(event) => {props.equals(event)}}>=</button>
  );
};

/* This one renders the clear button. */ 
const Clear = (props) => {
  return (
    <button id="clear" onClick={() => {props.clear()}}>Clear</button>
  );
};

/* This is the component that shows the current number being entered. */
const Display = (props) => {
  return (
  <h1 id="display">{props.display}</h1>
  );
};

/* This component shows the running formula */
const Formula = (props) => {
  return (
  <h2 id="formula">{props.formula}</h2>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: '0',
      formula: '',
      decimalUsed: false,
      dataEntered: false,
      operatorEntered: false,
      lastEntry: '',
      currentEntry: '',
      negativeSign: false,
      lastAnswer: '',
      answered: false,
    };
    this.handleNumbers = this.handleNumbers.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
  }

  /*This deals with number entry rules. */
  handleNumbers(event) {
    /* If no number has been entered, a non-zero number is allowed. */
    if (!this.state.dataEntered) {
     // if (event.target.value !== '0') {
        this.setState({
            display: event.target.value,
            dataEntered: true,
            lastEntry: event.target.value,
            currentEntry: event.target.value,
        });  
      //} 
      /* If a number has begun, keep adding digits. */
    } else if (this.state.currentEntry === "0") {
      return;
    }
       else if (this.state.dataEntered) {
        if (!(this.state.currentEntry === '0' && event.target.value === '0')) {
          this.setState({
            display: this.state.display + event.target.value,
            lastEntry: event.target.value,
            currentEntry: this.state.currentEntry + event.target.value
          });
        }
      /* After a decimal, allow zeroes. Not sure that this is neccessary. */
    } else if (this.state.decimalUsed === true) {
      this.setState({
        display: this.state.display + event.target.value,
        lastEntry: event.target.value,
        currentEntry: this.state.currentEntry + event.target.value,
      });
    }
  }

  handleDecimal(event) {
    if (this.state.decimalUsed === false && this.state.dataEntered === false) {
      this.setState({
        display: '0' + event.target.value,
        decimalUsed: true, 
        dataEntered: true,
        lastEntry: event.target.value,
        currentEntry: '0' + event.target.value,
      });
    } else if (this.state.decimalUsed === false) {
      this.setState({
        display: this.state.display + event.target.value,
        decimalUsed: true,
        lastEntry: event.target.value,
        currentEntry: '0' + event.target.value,
      });
    }
  }

  parenthCloseTest() {
    if (this.state.negativeSign === true) {
      return ')';
    } return '';
  }

  handleOperator(event) {
    if (this.state.answered) {
      this.setState({
        formula: this.state.lastAnswer.toString() + event.target.value,
        answered: false,
      });
      return
    }
    /* checks for an open '(' and returns a ')' */ 
    const parenthClose = this.parenthCloseTest();
    /* regex to check for operator input */
    const operators = /\+|-|\*|\/|=/;

    /* checks for previous operator input. If not, adds operator to formula with closing parentesis if needed.
    Then it resets input flags for the next numerical entry  */ 
    if (!operators.test(this.state.lastEntry)) {
      this.setState({
        formula: this.state.formula + this.state.display + parenthClose + event.target.value,
        operatorEntered: true,
        decimalUsed: false,
        dataEntered: false,
        lastEntry: event.target.value,
        negativeSign: false,
      });
      /* If a negative sign is input after another operator, this adds an open parenthesis. */
    } else if (event.target.value === '-') {
      this.setState({
        formula: this.state.formula + '(' + event.target.value,
        lastEntry: event.target.value,
        negativeSign: true,
      });
      /* If any other operators are input consecutively, this replaces the previous entry with the latest one.  */
    } else {
        var alteredFormula = '';
        if (this.state.lastEntry === "-") {
          alteredFormula = this.state.formula.slice(0, -3) + event.target.value;
        } else {
            alteredFormula = this.state.formula.slice(0, -1) + event.target.value;
          } 
        this.setState({
          formula: alteredFormula,
          lastEntry: event.target.value,
          negativeSign: false,
        });
    }
  }

  handleEquals() {
    const parenthClose = this.parenthCloseTest();
    const formula = this.state.formula + this.state.display + parenthClose;
    /* This is the safe way to do an eval on a string. */
    const answer = Function('"use strict"; return(' + formula + ')')();
    //const precisionAnswer = answer.toFixed(4);
    this.setState({
      formula: formula + '=' + answer,
      display: answer,
      lastEntry: "=",
      lastAnswer: answer,
      decimalUsed: false,
      dataEntered: false,
      operatorEntered: false,
      negativeSign: false,
      answered: true,
    });
  }

  handleClear() {
    this.setState({
      display: '0',
      formula: '',
      decimalUsed: false,
      dataEntered: false,
      operatorEntered: false,
      lastEntry: '',
      negativeSign: false,
      lastAnswer: '',
      answered: false,
    });
  }

  render() {
    return (
      <div className="App">
        <div id="combined-display">
          <Formula formula={this.state.formula} />
          <Display display={this.state.display}/>
        </div>
        <DataEntry 
          number={this.handleNumbers}
          decimal={this.handleDecimal}
          operator={this.handleOperator}/>
        <Equals equals={this.handleEquals}/>
        <Clear clear={this.handleClear}/>
        <ReactFCCtest />
      </div>
    );  
  }
}

export default App;
