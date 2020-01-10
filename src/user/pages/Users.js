import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  const [loading, setLoading] = React.useState(true)
  const [users, setUsers] = React.useState([])

  React.useEffect(() => {
    getUsers()

  }, [])

  async function getUsers() {
    try {
      const r = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/users`)

      if (r && r.status === 200){
        const data = await r.json()
        setUsers(data.users)
      }

    } catch (e) {
      console.log('Error getting users: ', e.message)

    }finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading Users...</div>
  return <UsersList items={users} />;
};

export default Users;
