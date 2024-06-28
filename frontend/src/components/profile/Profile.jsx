function Profile({ user }) {
  return (
    <div className='avatar'>
      <img
        alt='avatar'
        width={100}
        src={`${process.env.REACT_APP_API_URL.replace('/api', '')}/${user.avatar}`}
      />
      <div style={{ fontFamily: 'monospace', color: 'white' }}>
        {user?.fullName}
      </div>
    </div>
  );
}

export default Profile;
