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
