import React, {useState, useEffect, useCallback} from 'react'

let logoutTimer

const UseAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(0);
    const [userToken, setUserToken] = useState('')

    useEffect(() => {
        getToken()
    }, [])

    const getToken = () => {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')
        if (token) {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            const actualDate = new Date()
            if (expirationDate > actualDate) {
                setUserToken(token)
                setUserId(userId)
                setIsLoggedIn(true)

                autoLogOut(expirationDate, actualDate)
            } else {
                removeToken()
            }
        }
    }

    const autoLogOut = (expirationDate, actualDate) => {
        logoutTimer = setTimeout(() => {
            removeToken()
            setUserToken('')
            setUserId(0)
            setIsLoggedIn(false)
        }, (expirationDate.getTime() - actualDate.getTime()))
    }

    const setToken = (token, usrId, expirationDate) => {
        localStorage.setItem('token', token)
        localStorage.setItem('userId', usrId)
        localStorage.setItem('expirationDate', expirationDate.toISOString())
    }

    const removeToken = () => {
        try {
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            localStorage.removeItem('expirationDate')
        } catch (e) {
            console.error('Could not remove -token or userId- from local storage')
        }
    }

    const login = useCallback((userId, token) => {
        const expirationDate = new Date(new Date().getTime() + 1000 * 60 * 60)
        const actualDate = new Date()

        setIsLoggedIn(true);
        setUserId(userId)
        setUserToken(token)
        setToken(token, userId, expirationDate)
        autoLogOut(expirationDate, actualDate)
    }, []);

    const logout = useCallback(() => {
        setIsLoggedIn(false);
        setUserId(0)
        removeToken()
    }, []);

    return {userId, userToken, isLoggedIn, login, logout}
}

export default UseAuth
