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
      x: 100,
      y: 100,
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
      dx = 3;
    } else {
      dx = -3;
    }
    if(e.pageY > this.state.ball.y) {
      dy = 3;
    } else {
      dy = -3;
    }
    console.log(dx + ' ' + dy)
    let newState = {...this.state.ball, dx: dx, dy: dy}
    this.setState({ball: newState});

  }

  draw(ctx) {
    this.clear(ctx);
    let newState = {...this.state.ball, x: this.state.ball.x + this.state.ball.dx, y: this.state.ball.y + this.state.ball.dy};
    this.setState({ball: newState})
    //this.drawBackGround(ctx)
/*    window.scrollTo(this.state.ball.x, this.state.ball.y)
    this.state.ball.draw(ctx, this.state.ball.x + window.innerWidth / 2, this.state.ball.y + window.innerHeight / 2);*/
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