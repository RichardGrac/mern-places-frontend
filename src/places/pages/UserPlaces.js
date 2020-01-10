import React from 'react';
import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList';

export const PlacesContext = React.createContext([])

const UserPlaces = () => {
  const [loading, setLoading] = React.useState(true)
  const [places, setPlaces] = React.useState([])
  const userId = React.useState(useParams().userId)[0]

  React.useEffect(() => {
    console.log('userId: ', userId)
    getPlaces(userId)
  }, [])

  const getPlaces = async () => {
    const r = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/places/user/${userId}`)

    if (r) {
      const data = await r.json()
      if (data.places && data.places.length > 0){
        setPlaces(data.places)
      }else {
        setPlaces([])
      }
      setLoading(false)
    }
  }

  const deleteAPlace = pid => {
    const newPlaces = places.filter(p => p.id !== pid)
    setPlaces(newPlaces)
  }

  if (loading) return <div>Loading places...</div>
  else return (
      <PlacesContext.Provider value={[places, deleteAPlace]}>
        <PlaceList />
      </PlacesContext.Provider>
  )
};

export default UserPlaces;
