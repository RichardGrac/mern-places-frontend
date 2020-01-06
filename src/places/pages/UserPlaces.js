import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import {BACKEND_URL} from '../../shared/util/urls'

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
    const r = await fetch(`${BACKEND_URL}api/places/user/${userId}`)

    if (r) {
      const data = await r.json()
      if (data.places && data.places.length > 0){
        const placesWithImage = data.places.map(p => {
          p.imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg'
          return p
        })
        setPlaces(placesWithImage)
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
