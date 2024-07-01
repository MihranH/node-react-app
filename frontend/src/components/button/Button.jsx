import { Button } from 'antd';
import './Button.scss';

function ButtonComponent({ title, type, onClick, loading }) {
  return (
    <Button
      className='button'
      htmlType={type}
      onClick={onClick}
      loading={!!loading}
    >
      {title}
    </Button>
  );
}

export default ButtonComponent;
