import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Callout, Marker } from 'react-native-maps';

import db from '../../db.json';
import User from '../types/user';

interface UserMarkerProps {
    data: User;
    handleCalloutPress: (username: string) => void;
}

export default function UserMarker({ data: user, handleCalloutPress }: UserMarkerProps) {
    // TODO: use context to get current user (let's just assume it's the first one for now)
    const isCurrentUser = user.login === (db.users as any)[0].login;

    return (
        <Marker key={user.id} coordinate={user.coordinates}>
            <Image
                style={[styles.avatar, isCurrentUser && styles.currentUser]}
                source={{ uri: user.avatar_url }}
                resizeMode="contain"
            />
            <Callout onPress={() => handleCalloutPress(user.login)}>
                <View style={styles.callout}>
                    <Text style={styles.devName}>{user.name}</Text>
                    <Text style={styles.devCompany}>{user.company}</Text>
                    <Text style={styles.devBio}>{user.bio}</Text>
                </View>
            </Callout>
        </Marker>
    );
}

const styles = StyleSheet.create({
    avatar: {
        width: 64,
        height: 64,
        borderWidth: 4,
        borderColor: '#E8EAED',
        borderRadius: 32,
    },

    currentUser: {
        borderColor: '#4285F4',
    },

    callout: {
        width: 240,
    },

    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    devCompany: {
        color: '#666',
        fontSize: 12,
    },

    devBio: {
        color: '#666',
        marginTop: 5,
    },
});
