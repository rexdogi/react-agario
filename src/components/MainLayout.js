/**
 * Created by Paulius on 5/8/2017.
 */
import React, {Component} from 'react';
import io from 'socket.io-client';

export default class MainLayout extends Component {

  constructor(props) {
    super(props)
    this.state = {
      width: 11000,
      height: 11000,
      objects: [this.ball(500, 500, true, 30)]
    }
    this.loop = this.loop.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({objects: props.objects})
  }

  drawObject = (ctx, x, y, radius) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = 'blue';
    ctx.fill();
  }

  ball = (x, y, isControlled, radius) => {
    return {
      isPlayer: isControlled,
      x: x,
      y: y,
      dx: 0,
      dy: 0,
      radius: radius,
      color: 'blue',
    };
  }

  startLoop() {
    if( !this._frameId ) {
      this._frameId = window.requestAnimationFrame( this.loop );
    }
  }

  loop() {
    this.draw(this.state.ctx);
    this.frameId = window.requestAnimationFrame( this.loop )
  }


  randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  componentDidMount() {
    let socket = io('http://localhost:8080/');
    socket.emit('lul', function(data) {
      console.log(data);
    });
    socket.on('update', (data) => {
      this.setState({objects: data})
    })
    this.setState({ctx: this.refs.ctx.getContext("2d"), socket: socket}, () => {
      this.state.socket.emit('lul');
      this.startLoop();
    });
  }

  canvasStyle = () => {
    return {
      display: "block",
    }
  }

  scrolled(e, ctx) {
    //e.preventDefault();
  }

  getVelocity(x) {
    let velocity = Math.log2(x);
    if(velocity > 8) {
      velocity = 8;
    }
    return velocity
  }

  move(e) {
    this.state.objects.map((item) => {
      if(item.id === this.state.socket.id) {
        console.log("moving");
        const angle = Math.cos(this.getAngle(item.x, item.y, e.pageX, e.pageY) * (Math.PI / 180));
        const angle2 = Math.sin(this.getAngle(item.x, item.y, e.pageX, e.pageY) * (Math.PI / 180));
        let distanceX = Math.abs(e.pageX - item.x);
        let distanceY = Math.abs(e.pageY - item.y);
        let dx, dy;
        dx = angle * this.getVelocity(distanceX * 2.5);
        dy = angle2 * this.getVelocity(distanceY * 2.5);
        this.state.socket.emit('update', {x: dx, y: dy, id: this.state.socket.id});
      }
    })
  }

  getAngle(x1, y1, x2, y2) {
    const x =  Math.atan2(y2 - y1, x2 - x1);
    return (x > 0 ? x : (2*Math.PI + x)) * 360 / (2*Math.PI)
  }

  draw(ctx) {
    this.clear(this.state.ctx);
    this.state.objects.map((item, i) => {
      if(item.id === this.state.socket.id) {
        let posX, posY = 0;
        if ((item.x + item.dx) <= this.state.width - 300 && item.x + item.dx >= 300) {
          posX = item.x + item.dx
        } else {
          posX = item.x;
        }

        if ((item.y + item.dy) <= this.state.height - 300 && item.y + item.dy >= 300) {
          posY = item.y + item.dy
        } else {
          posY = item.y;
        }

        if (item.isPlayer === true) {
          window.scrollTo(item.x - window.innerWidth / 2, item.y - window.innerHeight / 2)
        }
      }
      this.drawObject(ctx, item.x, item.y, item.radius);
    })

  }

  clear(ctx) {
    ctx.clearRect(0, 0, this.state.width, this.state.height);
  }

  render() {
    return (
      <div>
        <canvas onMouseMove={(event) => this.move(event)} onWheel={(event) => this.scrolled(event)} width={this.state.width} height={this.state.height} ref="ctx" id="myCanvas" style={this.canvasStyle()} />
      </div>
    )
  }
}