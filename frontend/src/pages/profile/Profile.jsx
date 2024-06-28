import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Profile.scss';
import Carousel from '../../components/carousel/Carousel';
import ProfileComponent from '../../components/profile/Profile';
import Button from '../../components/button/Button';
import { logout } from '../../store/actions/auth';

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const photos = user.photos.map(
    (photo) =>
      `${process.env.REACT_APP_API_URL.replace('/api', '')}${user.imagePath}/${photo}`,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className='home-page'>
      <div className='profile'>
        <ProfileComponent user={user} />
        <Button
          title='Logout'
          onClick={() =>
            dispatch(
              logout((res) => {
                if (res) {
                  navigate('/login', { replace: true });
                }
              }),
            )
          }
        />
      </div>
      <Carousel photos={photos} />
    </div>
  );
}

export default Profile;
