import { Button } from 'antd';
import './Button.scss';

function ButtonComponent({ title, type, onClick }) {
  return (
    <Button className='button' htmlType={type} onClick={onClick}>
      {title}
    </Button>
  );
}

export default ButtonComponent;
