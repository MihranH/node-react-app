import { useState } from 'react';
import { Form, Input, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ButtonComponent from '../../components/button/Button';
import { register, upload } from '../../store/actions/auth';
import UploadComponent from '../../components/uploader/Uploader';
import {
  NAME_MIN,
  NAME_MAX,
  PASSWORD_MAX,
  PASSWORD_MIN,
  PHOTOS_MIN_AMOUNT,
} from '../../constants';

function Register() {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getPhotos = () => {
    const formData = new FormData();
    photos.forEach((el) => {
      formData.append('file', el.originFileObj);
    });
    return formData;
  };

  const showError = (msg) => {
    message.destroy();
    message.error(msg);
  };

  const registerFunc = async () => {
    if (password !== confirmPassword) {
      return showError('Passwords should match');
    }
    if (photos.length < PHOTOS_MIN_AMOUNT) {
      return showError(
        `Minimum ${PHOTOS_MIN_AMOUNT} photos should be uploaded`,
      );
    }
    setLoading(true);
    dispatch(
      register({ firstName, lastName, email, password }, (res) => {
        if (res.userId) {
          dispatch(
            upload({ photos: getPhotos(), userId: res.userId }, (resUpload) => {
              setLoading(false);
              if (resUpload === true) {
                message.success('Successfully registered!');
                navigate('/login', { replace: true });
              } else {
                showError(
                  resUpload && typeof resUpload === 'string'
                    ? resUpload
                    : 'Registration failed due to upload',
                );
              }
            }),
          );
        } else {
          setLoading(false);
          showError(
            res && typeof res === 'string' ? res : 'Registration Failed',
          );
        }
      }),
    );
    return true;
  };

  const uploadData = {
    name: 'file',
    multiple: false,
    action: '',
    accept: 'image/*',
    showUploadList: true,
    listType: 'picture',
    customRequest: (data) => {
      data.onSuccess();
    },
    async onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        setPhotos(info.fileList);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        showError(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <div className='auth-page'>
      <div className='center'>
        <div className='body'>
          <h1>Registration</h1>
          <Form onFinish={registerFunc} layout='vertical'>
            <Form.Item
              label='First Name'
              name='firstName'
              rules={[
                {
                  required: true,
                  message: 'Please input your first name',
                },
              ]}
            >
              <Input
                minLength={NAME_MIN}
                maxLength={NAME_MAX}
                placeholder='First name'
                name='firstName'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label='Last Name'
              name='lastName'
              rules={[
                {
                  required: true,
                  message: 'Please input your last name',
                },
              ]}
            >
              <Input
                minLength={NAME_MIN}
                maxLength={NAME_MAX}
                placeholder='Last name'
                name='lastName'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label='Email'
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Please input your email',
                },
                {
                  message: 'Please provide valid email',
                  validator: () => {
                    if (!email) {
                      return Promise.resolve();
                    }
                    const emailRegexp = /[a-z0-9]+@[a-z]+.[a-z]{2,3}/;
                    if (!emailRegexp.test(email)) {
                      return Promise.reject();
                    }
                    return Promise.resolve();
                  },
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
              label='Password'
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please input your password',
                },
                {
                  message: 'Please provide at least one number',
                  validator: () => {
                    if (!password) {
                      return Promise.resolve();
                    }
                    const passwordRegexp = /.*[0-9].*/;
                    if (!passwordRegexp.test(password)) {
                      return Promise.reject();
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.Password
                minLength={PASSWORD_MIN}
                maxLength={PASSWORD_MAX}
                placeholder='Password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label='Confirm Password'
              name='confirmPassword'
              rules={[
                {
                  required: true,
                  message: 'Please input your password',
                },
              ]}
            >
              <Input.Password
                placeholder='Confirm Password'
                name='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Item>
            <UploadComponent data={uploadData} />
            <Form.Item>
              <ButtonComponent
                title='Register'
                type='submit'
                loading={loading}
              />
            </Form.Item>
            <Link to='/login'>Sign in</Link>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
