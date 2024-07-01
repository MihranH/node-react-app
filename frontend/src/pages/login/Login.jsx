import { useState } from 'react';
import { Form, Input, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ButtonComponent from '../../components/button/Button';
import { login } from '../../store/actions/auth';

function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginFunc = async () => {
    setLoading(true);
    dispatch(
      login({ email, password }, (res) => {
        setLoading(false);
        if (res === true) {
          navigate('/profile', { replace: true });
        } else {
          message.destroy();
          message.error(
            res && typeof res === 'string' ? res : 'Invalid Credentials',
          );
        }
      }),
    );
  };

  return (
    <div className='auth-page'>
      <div className='center'>
        <div className='body'>
          <h1>LOGIN</h1>
          <Form onFinish={loginFunc} layout='vertical'>
            <Form.Item
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Please input your email',
                },
              ]}
            >
              <Input
                placeholder='Email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please input your password',
                },
              ]}
            >
              <Input.Password
                placeholder='Password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <ButtonComponent title='Login' type='submit' loading={loading} />
            </Form.Item>
            <Link to='/register'>Create account</Link>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
