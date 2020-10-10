import React from 'react';
import ReactFCCtest from 'react-fcctest';
import './App.css';

const DataEntry = (props) => {
  return (
    <div className="numbers">
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
      <button id="add" value="+" onClick={(event) => {props.operator(event)}}>+</button>
      <button id="subtract" value="-" onClick={(event) => {props.operator(event)}}>-</button>
      <button id="multiply" value="*" onClick={(event) => {props.operator(event)}}>x</button>
      <button id="divide" value="/" onClick={(event) => {props.operator(event)}}>/</button>
    </div>
  );
};

const Equals = (props) => {
  return(
  <button id="equals" onClick={(event) => {props.equals(event)}}>=</button>
  );
};

const Clear = (props) => {
  return (
    <button id="clear" onClick={() => {props.clear()}}>Clear</button>
  );
};

const Display = (props) => {
  return (
  <h1 id="display">{props.display}</h1>
  );
};

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
      negativeSign: false,
    };
    this.handleNumbers = this.handleNumbers.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
  }

  handleNumbers(event) {
    if (event.target.value !== '0') {
      if (!this.state.dataEntered) {
        this.setState({
            display: event.target.value,
            dataEntered: true,
            lastEntry: event.target.value,
        });  
      } else if (this.state.dataEntered) {
        this.setState({
          display: this.state.display + event.target.value,
          lastEntry: event.target.value,
        });
      }
    }
  }

  handleDecimal(event) {
    if (this.state.decimalUsed === false && this.state.dataEntered === false) {
      this.setState({
        display: '0' + event.target.value,
        decimalUsed: true, 
        dataEntered: true,
        lastEntry: event.target.value,
      });
    } else if (this.state.decimalUsed === false) {
      this.setState({
        display: this.state.display + event.target.value,
        decimalUsed: true,
        lastEntry: event.target.value,
      });
    }
  }

  parenthCloseTest() {
    if (this.state.negativeSign === true) {
      return ')';
    } return '';
  }

  handleOperator(event) {
    const parenthClose = this.parenthCloseTest();
    const operators = /\+|-|\*|\//;
    if (!operators.test(this.state.lastEntry)) {
      this.setState({
        formula: this.state.formula + this.state.display + parenthClose + event.target.value,
        operatorEntered: true,
        decimalUsed: false,
        dataEntered: false,
        lastEntry: event.target.value,
      });
    } else if (event.target.value === '-') {
      this.setState({
        formula: this.state.formula + '(' + event.target.value,
        lastEntry: event.target.value,
        negativeSign: true,
      });
    } else {
      const alteredFormula = this.state.formula.slice(0, -1) + event.target.value;
      this.setState({
        formula: alteredFormula,
        lastEntry: event.target.value,
      })
    }
  }

  handleEquals(event) {
    const parenthClose = this.parenthCloseTest();
    const formula = this.state.formula + this.state.display;
    const answer = eval(formula);
    this.setState({
      formula: formula + parenthClose + "=",
      display: answer,
      lastEntry: "="
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
    });
  }

  render() {
    return (
      <div className="App">
        <Formula formula={this.state.formula} />
        <Display display={this.state.display}/>
        <DataEntry 
          number={this.handleNumbers}
          decimal={this.handleDecimal}
          operator={this.handleOperator}/>
        <Equals equals={this.handleEquals}/>
        <Clear clear={this.handleClear}/>
        
      </div>
    );  
  }
}

export default App;
