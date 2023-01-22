import * as github from '../services/github';

import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, TextInput } from 'react-native';
import MapView, { LatLng, MapPressEvent, Marker, PoiClickEvent, Region } from 'react-native-maps';

import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';

import BigButton from '../components/BigButton';
import { AuthenticationContext } from '../context/AuthenticationContext';
import { postUser } from '../services/api';
import { tryGetCurrentPosition } from '../utils/location';

export default function Setup({ navigation }: StackScreenProps<any>) {
    const authenticationContext = useContext(AuthenticationContext);
    const [username, setUsername] = useState('');

    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

    const defaultLocation = { latitude: 51.03, longitude: -114.093 };

    const [markerLocation, setMarkerLocation] = useState<LatLng>(defaultLocation);
    const [currentRegion, setCurrentRegion] = useState<Region>({
        ...defaultLocation,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
    });

    useEffect(() => {
        tryGetCurrentPosition()
            .then((curPos) => {
                setMarkerLocation(curPos);
                setCurrentRegion({ ...currentRegion, ...curPos });
            })
            .catch(() => {
                /* do nothing and keep the default location and region */
            });
    }, []);

    const handleMapPress = (event: MapPressEvent | PoiClickEvent) => {
        setMarkerLocation(event.nativeEvent.coordinate);
    };

    const handleSignUp = async () => {
        setIsAuthenticating(true);
        github
            .getUserInfo(username)
            .catch((err) => {
                if (axios.isAxiosError(err) && err.response?.status == 404) {
                    return Promise.reject('There is no such username on GitHub.');
                } else {
                    return Promise.reject(err);
                }
            })
            .then(({ data: githubInfo }) =>
                postUser({
                    login: githubInfo.login,
                    avatar_url: githubInfo.avatar_url,
                    bio: githubInfo.bio,
                    company: githubInfo.company,
                    name: githubInfo.name,
                    coordinates: markerLocation,
                })
            )
            .then(() => {
                authenticationContext?.setValue(username);
                navigation.replace('Main');
            })
            .catch((err) => Alert.alert(String(err)))
            .finally(() => setIsAuthenticating(false));
    };

    return (
        <>
            <StatusBar style="dark" />
            <KeyboardAwareScrollView
                style={styles.container}
                contentContainerStyle={{
                    padding: 24,
                    flexGrow: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'stretch',
                }}
            >
                <MapView
                    onPress={handleMapPress}
                    onPoiClick={handleMapPress}
                    region={currentRegion}
                    style={styles.map}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    toolbarEnabled={false}
                    showsIndoors={false}
                    mapType="mutedStandard"
                    provider="google"
                    mapPadding={{ top: 0, right: 24, bottom: 128, left: 24 }}
                >
                    <Marker coordinate={markerLocation} />
                </MapView>
                <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Insert your GitHub username"
                    onChangeText={setUsername}
                />
                <BigButton onPress={handleSignUp} label="Sign Up" color="#031A62" />
                <Spinner
                    visible={isAuthenticating}
                    textContent="Authenticating..."
                    overlayColor="#031A62BF"
                    textStyle={styles.spinnerText}
                />
            </KeyboardAwareScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },

    spinnerText: {
        fontSize: 16,
        color: '#fff',
    },

    input: {
        backgroundColor: '#fff',
        borderColor: '#031b6233',
        borderRadius: 4,
        borderWidth: 1,
        height: 56,
        paddingVertical: 16,
        paddingHorizontal: 24,
        marginBottom: 16,
        color: '#333',
        fontSize: 16,
    },

    error: {
        color: '#fff',
        fontSize: 12,
    },
});
