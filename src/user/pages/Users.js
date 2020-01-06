import React from 'react';

import UsersList from '../components/UsersList';
import {BACKEND_URL} from '../../shared/util/urls'

const Users = () => {
  const [loading, setLoading] = React.useState(true)
  const [users, setUsers] = React.useState([])

  React.useEffect(() => {
    getUsers()

  }, [])

  async function getUsers() {
    try {
      const r = await fetch(`${BACKEND_URL}api/users`)

      if (r){
        const data = await r.json()
        const usersWithImage = data.users.map(u => {
          u.image = 'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
          u.placeCount = 0
          return u
        })
        setUsers(usersWithImage)
      }

    } catch (e) {
      console.log('e.message: ', e.message)

    }finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading Users...</div>
  return <UsersList items={users} />;
};

export default Users;
