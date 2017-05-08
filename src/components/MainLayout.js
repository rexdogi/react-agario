/**
 * Created by Paulius on 5/8/2017.
 */
import React, {Component} from 'react';

export default class MainLayout extends Component {

  constructor(props) {
    super(props)
    this.state = {
      width: 11000,
      height: 11000,
      ball: null
    }
    this.loop = this.loop.bind(this);
  }

  ball = () => {
    return {
      x: 4000,
      y: 4000,
      dx: 0,
      dy: 0,
      radius: 25,
      color: 'blue',
      draw: (ctx, x, y) => {
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = 'blue';
        ctx.fill();
      }
    };
  }

  startLoop() {
    if( !this._frameId ) {
      this._frameId = window.requestAnimationFrame( this.loop );
    }
  }

  loop() {
    // perform loop work here
    this.draw(this.state.ctx);

    // Set up next iteration of the loop
    this.frameId = window.requestAnimationFrame( this.loop )
  }

  componentDidMount() {
    this.setState({ctx: this.refs.ctx.getContext("2d"), ball: this.ball(this.refs.ctx.getContext("2d"))}, () => {
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

  move(e) {
    let dx = 0;
    let dy = 0;
    console.log(this.state.ball.y + ' ' + e.pageY)
    if(e.pageX > this.state.ball.x) {
      dx = 10;
    } else {
      dx = -1;
    }
    if(e.pageY > this.state.ball.y) {
      dy = 10;
    } else {
      dy = -10;
    }
    console.log(dx + ' ' + dy)
    let newState = {...this.state.ball, dx: dx, dy: dy}
    this.setState({ball: newState});

  }

  draw(ctx) {
    this.clear(ctx);
    let posX, posY = 0;
    if((this.state.ball.x + this.state.ball.dx) <= this.state.width - 1000 && this.state.ball.x + this.state.ball.dx >= 1000) {
      posX = this.state.ball.x + this.state.ball.dx
    } else {
      posX = this.state.ball.x;
    }

    if((this.state.ball.y + this.state.ball.dy) <= this.state.height - 1000 && this.state.ball.y + this.state.ball.dy >= 1000) {
      posY = this.state.ball.y + this.state.ball.dy
    } else {
      posY = this.state.ball.y;
    }
    let newState = {...this.state.ball, x: posX, y: posY};
    this.setState({ball: newState})
    window.scrollTo(this.state.ball.x - window.innerWidth / 2, this.state.ball.y - window.innerHeight / 2)
    this.state.ball.draw(ctx, this.state.ball.x, this.state.ball.y);
  }
s
  clear(ctx) {
    ctx.clearRect(0, 0, this.state.width, this.state.height);
  }

  render() {
    return (
      <div>
        <canvas onMouseMove={(event) => this.move(event)} onWheel={(event) => this.scrolled(event, this.refs.ctx.getContext("2d"))} width={this.state.width} height={this.state.height} ref="ctx" id="myCanvas" style={this.canvasStyle()} />
      </div>
    )
  }
}