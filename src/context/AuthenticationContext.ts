import { createContext } from 'react';

export type AuthenticationContextObject = {
    value: string | null;
    setValue: (newValue: string | null) => void;
};

export const AuthenticationContext = createContext<AuthenticationContextObject | null>(null);
