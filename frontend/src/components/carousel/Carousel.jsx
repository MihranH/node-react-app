import { Carousel } from 'antd';
import './Carousel.scss';

function CarouselComponent({ photos }) {
  return (
    <div>
      <h2 className='center' style={{ color: '#fff', fontSize: '30px' }}>
        Carousel for photos
      </h2>
      <Carousel
        afterChange={() => {}}
        className='carousel'
        autoplay
        speed={1000}
      >
        {photos.map((photo) => (
          <div className='center' key={photo}>
            <div className='content'>
              <img alt='avatar' width={300} height={380} src={photo} />
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default CarouselComponent;
