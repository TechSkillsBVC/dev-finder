import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, TextInput, View } from 'react-native';
import MapView, { LatLng, MapPressEvent, Marker, PoiClickEvent, Region } from 'react-native-maps';
import { DEFAULT_LOCATION, tryGetCurrentPosition } from '../utils/location';

import { StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import Spinner from 'react-native-loading-spinner-overlay';
import BigButton from '../components/BigButton';

export default function Setup({ navigation }: StackScreenProps<any>) {
    // TODO: use username to fetch user data from GitHub API and store it in the app state
    const [username, setUsername] = useState('');

    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

    const [markerLocation, setMarkerLocation] = useState<LatLng>(DEFAULT_LOCATION);
    const [currentRegion, setCurrentRegion] = useState<Region>({
        ...DEFAULT_LOCATION,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
    });

    useEffect(() => {
        tryGetCurrentPosition()
            .then((curPos: LatLng) => {
                setMarkerLocation(curPos);
                setCurrentRegion({ ...currentRegion, ...curPos });
            })
            .catch(() => {
                /* do nothing and keep the default location and region */
            });
    }, []);

    function handleMapPress(event: MapPressEvent | PoiClickEvent) {
        setMarkerLocation(event.nativeEvent.coordinate);
    }

    function handleSignUp() {
        // TODO: handle sign up logic. For now, we'll just fake it.
        setIsAuthenticating(true);
        navigation.replace('Main');
        setTimeout(() => {
            setIsAuthenticating(false);
        }, 2000);
    }

    return (
        <>
            <StatusBar style="dark" />
            <View testID="setup-screen" style={styles.container}>
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
                    mapPadding={{ top: 0, right: 24, bottom: 128, left: 24 }}
                >
                    <Marker coordinate={markerLocation} />
                </MapView>
                <KeyboardAvoidingView style={styles.form} behavior="position">
                    <TextInput
                        testID="input"
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Insert your GitHub username"
                        onChangeText={setUsername}
                    />
                    <BigButton testID="button" onPress={handleSignUp} label="Sign Up" color="#031A62" />
                </KeyboardAvoidingView>
            </View>
            <Spinner
                visible={isAuthenticating}
                textContent="Authenticating..."
                overlayColor="#031A62BF"
                textStyle={styles.spinnerText}
            />
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

    form: {
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        padding: 24,
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
