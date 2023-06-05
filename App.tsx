import React, { useEffect, useState } from 'react';
import { AuthenticationContext, AuthenticationContextObject } from './src/context/AuthenticationContext';
import Routes from './src/routes';
import { getFromStorage, removeFromStorage, setInStorage } from './src/services/storage';

export default function App() {
    const [username, setUsername] = useState<string | null>(null);
    const [initialRouteName, setInitialRouteName] = useState<string>();

    const authenticationContextObj: AuthenticationContextObject = {
        value: username,
        setValue: (username) => {
            setUsername(username);
            if (username) {
                setInStorage('currentUser', username);
            } else {
                removeFromStorage('currentUser');
            }
        },
    };

    useEffect(() => {
        getFromStorage<string>('currentUser')
            .then((storedUser) => {
                setUsername(storedUser);
                setInitialRouteName('Main');
            })
            .catch(() => setInitialRouteName('Setup'));
    }, []);

    return (
        <AuthenticationContext.Provider value={authenticationContextObj}>
            {initialRouteName && <Routes initialRouteName={initialRouteName} />}
        </AuthenticationContext.Provider>
    );
}
