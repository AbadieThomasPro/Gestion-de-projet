export default function Avatar({ user, size = 40 }) {
  const style = { width: size, height: size, fontSize: size / 2.5 };

  if (user?.avatar) {
    return <img className="avatar" src={user.avatar} alt="" style={style} />;
  }

  return (
    <div className="avatar" style={style}>
      {user?.firstName?.[0]}
      {user?.lastName?.[0]}
    </div>
  );
}
