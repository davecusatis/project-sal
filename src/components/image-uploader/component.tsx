import * as React from 'react';
import './component.scss';

const ALLOWED_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];

interface PublicProps {
  assetName: string;
}

interface State {
  error: string;
  loadedImage: HTMLImageElement;
}

export class ImageUploader extends React.Component<PublicProps, State> {
  constructor(props: PublicProps) {
    super(props);
    this.state = {
      error: '',
      loadedImage: new Image(),
    }
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    let loadedImg = new Image();
    const img = e.currentTarget.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      if (img.size > 25000) {
        this.setState({
          error: 'Exceeds size limits',
        });
        return;
      }

      if (ALLOWED_FORMATS.indexOf(img.type) === -1) {
        this.setState({
          error: `Format: ${img.type} not allowed.`,
        });
        return;
      }

      loadedImg.onload = () => {
        if (loadedImg.width < 0 || loadedImg.width > 128) {
          this.setState({
            error: 'Image width is greater than the allowed limit of 128px',
          });
          return;
        }
        if (loadedImg.height < 0 || loadedImg.height > 128) {
          this.setState({
            error: 'Image height is greater than the allowed limit of 128px',
          });
          return;
        }
        this.setState({
          loadedImage: loadedImg,
        });
      };
      loadedImg.src = reader.result as string;
    };
    reader.readAsDataURL(img);
    this.setState({
      error: '',
    })
  }

  public render() {
    const { error, loadedImage } = this.state;

    return (
      <div className='uploader-container'>
        {loadedImage.src &&
          <div>
            <img
              className='image-preview'
              src={loadedImage.src} />
          </div>}

        <input className='file-input'
          name={this.props.assetName}
          type='file'
          onChange={(e) => this.handleChange(e)} />

        {error &&
          <div className='upload-errors'>
            {error}
          </div>}
      </div>
    );
  }
}
