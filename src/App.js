import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Test from './Test'
import MainLayout from './components/MainLayout'

class App extends Component {

  constructor() {
    super()
  }

  ball = (x, y, isControlled, radius) => {
    return {
      isControlled: isControlled,
      x: x,
      y: y,
      dx: 0,
      dy: 0,
      radius: radius,
      color: 'blue',
      draw: (ctx, x, y, radius) => {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = 'blue';
        ctx.fill();
      }
    };
  }

  generateObjects() {
    const arr = [];
    for(let i = 0; i < 5000; i++) {
      arr.push(this.ball(this.randomIntFromInterval(300, 11000 - 300), this.randomIntFromInterval(300, 11000 - 300), false, 15))
    }
    return arr;
  }

  render() {
    return (
      <MainLayout/>
    )
  }
}

export default App;
