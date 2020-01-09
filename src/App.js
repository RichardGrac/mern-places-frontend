import React, {useState, useCallback} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import {AuthContext} from './shared/context/auth-context';

let logoutTimer

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(0);
    const [userToken, setUserToken] = useState('')

    React.useEffect(() => {
        getToken()
    }, [])

    const getToken = async () => {
        const token = await localStorage.getItem('token')
        const userId = await localStorage.getItem('userId')
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

    const removeToken = async () => {
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

    let routes;

    if (isLoggedIn) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users/>
                </Route>
                <Route path={`/:userId/places`} exact>
                    <UserPlaces/>
                </Route>
                <Route path="/places/new" exact>
                    <NewPlace/>
                </Route>
                <Route path="/places/:placeId">
                    <UpdatePlace/>
                </Route>
                <Redirect to="/"/>
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users/>
                </Route>
                <Route path="/:userId/places" exact>
                    <UserPlaces/>
                </Route>
                <Route path="/auth">
                    <Auth/>
                </Route>
                <Redirect to="/auth"/>
            </Switch>
        );
    }

    return (
        <AuthContext.Provider
            value={{isLoggedIn, login, logout, userId, userToken}}
        >
            <Router>
                <MainNavigation/>
                <main>{routes}</main>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;
