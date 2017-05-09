/**
 * Created by Paulius on 5/9/2017.
 */
import React, { Component } from 'react';

export default class Node extends Component {

  constructor(props) {
    super(props)
    this.state = {};
    this.loop = this.loop.bind(this);
  }

  startLoop() {
    if( !this._frameId ) {
      this._frameId = window.requestAnimationFrame( this.loop );
    }
  }

  loop() {
    this.draw(this.props.ctx);
    this.frameId = window.requestAnimationFrame( this.loop )
  }

  componentDidMount() {
    this.setState({ctx: this.props.ctx, ball: this.props.ball}, () => {
      this.startLoop();
    });
  }

  canvasStyle = () => {
    return {
      display: "block",
    }
  }

  scrolled(e, ctx) {
    e.preventDefault();
    const context = ctx;
    context.width = 10;
    this.setState({ctx: context});
  }

  getVelocity(x) {
    let velocity = Math.log2(x);
    if(velocity > 8) {
      velocity = 8;
    }
    return velocity
  }

  getAngle(x1, y1, x2, y2) {
    const x =  Math.atan2(y2 - y1, x2 - x1);
    return (x > 0 ? x : (2*Math.PI + x)) * 360 / (2*Math.PI)
  }

  draw(ctx) {
    this.clear(ctx);
    let posX, posY = 0;
    if((this.props.ball.x + this.props.ball.dx) <= this.props.width - 300 && this.props.ball.x + this.props.ball.dx >= 300) {
      posX = this.props.ball.x + this.props.ball.dx
    } else {
      posX = this.props.ball.x;
    }

    if((this.props.ball.y + this.props.ball.dy) <= this.props.height - 300 && this.props.ball.y + this.props.ball.dy >= 300) {
      posY = this.props.ball.y + this.props.ball.dy
    } else {
      posY = this.props.ball.y;
    }
    let newState = {...this.props.ball, x: posX, y: posY};
    this.setState({ball: newState})
    this.props.ball.draw(ctx, this.props.ball.x, this.props.ball.y);
  }

  clear(ctx) {
    ctx.clearRect(0, 0, this.state.width, this.state.height);
  }

  render() {
    return (
      <div>

      </div>
    );
  }
}