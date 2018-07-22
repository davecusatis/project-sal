import * as React from 'react';
import * as slot from '../../assets/img/slots.jpg';
interface State {
  slotImg: HTMLImageElement;
  canvas?: HTMLCanvasElement;
}

export class Canvas extends React.Component<{}, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: {}) {
    super(props);

    this.canvasRef = React.createRef();

    const c = this.canvasRef.current;

    let s = new Image();
    s.src = slot;
    s.addEventListener('load', this.slotsLoaded.bind(this));
    this.state = {
      canvas: c,
      slotImg: s,
    };
  }

  private slotsLoaded() {
    this.canvasRef.current.width = 300;
    this.canvasRef.current.height = 300;
    const ctx = this.canvasRef.current.getContext('2d');
    ctx.drawImage(this.state.slotImg, 0, 0);
  }

  // public componentDidMount() {
  //   this.setState({
  //     canvas: this.canvasRef.current,
  //   });
  // }
  public render() {

    return (
      <>
        <canvas ref={this.canvasRef} id='slotAnimation'></canvas>
      </>
    );
  }
}
