import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import './Uploader.scss';

function UploadComponent({ data }) {
  const { Dragger } = Upload;

  return (
    <div className='dragger-upload'>
      <Dragger {...data}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>
          Click or drag file to this area to upload
        </p>
      </Dragger>
    </div>
  );
}

export default UploadComponent;
