import { StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { LatLng, Region } from 'react-native-maps';

import db from '../../db.json';
import UserMarker from '../components/UserMarker';
import User from '../types/user';
import { DEFAULT_LOCATION, tryGetCurrentPosition } from '../utils/location';

export default function Main({ navigation }: StackScreenProps<any>) {
    const mapViewRef = useRef<MapView>(null);

    const [devs, setDevs] = useState<User[]>([]);
    const [userLocation, setUserLocation] = useState<LatLng>();
    const [currentRegion, setCurrentRegion] = useState<Region>();

    useEffect(() => {
        // TODO: fetch users from API. For now, we'll use a mock.
        const users = db.users as User[];
        setDevs(users);
        loadInitialPosition();
    }, []);

    function loadInitialPosition() {
        tryGetCurrentPosition()
            .catch(() => DEFAULT_LOCATION)
            .then((coords) => {
                setUserLocation(coords);
                setCurrentRegion({
                    ...coords,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                });
            });
    }

    function handleLogout() {
        navigation.replace('Setup');
    }

    function fitAll() {
        const locations: LatLng[] = devs.map((dev) => dev.coordinates);
        if (userLocation) locations.push(userLocation);
        mapViewRef.current?.fitToCoordinates(locations, {
            edgePadding: {
                top: 128,
                right: 64,
                bottom: 64,
                left: 64,
            },
            animated: true,
        });
    }

    if (!currentRegion) {
        return null;
    }

    return (
        <>
            <StatusBar style="dark" />
            <View testID="main-screen" style={styles.flex1}>
                <MapView
                    ref={mapViewRef}
                    style={styles.flex1}
                    initialRegion={currentRegion}
                    onMapReady={fitAll}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    moveOnMarkerPress={false}
                    toolbarEnabled={false}
                    showsIndoors={false}
                    mapType="mutedStandard"
                    mapPadding={{ top: 0, right: 24, bottom: 0, left: 24 }}
                >
                    {devs.map((dev) => (
                        <UserMarker
                            key={dev.id}
                            data={dev}
                            handleCalloutPress={(githubUsername) => {
                                navigation.navigate('Profile', { githubUsername });
                            }}
                        />
                    ))}
                </MapView>
                <RectButton style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonLabel}>Logout</Text>
                </RectButton>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },

    logoutButton: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 64,
        right: 24,
        height: 40,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#031A62',
        borderRadius: 4,
    },

    buttonLabel: {
        color: 'white',
    },
});
