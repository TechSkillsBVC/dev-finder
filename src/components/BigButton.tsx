import { StyleSheet, Text } from 'react-native';

import React from 'react';
import { RectButton } from 'react-native-gesture-handler';

interface BigButtonProps {
    label: string;
    color: string;
    style?: {};
    testID?: string;
    onPress: () => void;
}

export default function BigButton(props: BigButtonProps) {
    const styles = styling(props.color);
    const { label, style, onPress, testID } = props;

    return (
        <RectButton testID={testID} style={[styles.button, style]} onPress={onPress}>
            <Text style={styles.label}>{label}</Text>
        </RectButton>
    );
}

function styling(color: string) {
    return StyleSheet.create({
        button: {
            paddingVertical: 14,
            paddingHorizontal: 32,
            backgroundColor: color,
            maxHeight: 56,
            borderRadius: 4,

            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
        },

        icon: {
            marginRight: 8,
        },

        label: {
            color: '#FFF',
        },
    });
}
