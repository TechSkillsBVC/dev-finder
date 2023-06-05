import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as storage from './src/services/storage';



import { Alert } from 'react-native';
import { AxiosError } from 'axios';
import App from './App';
import { AuthenticationContext, AuthenticationContextObject } from './src/context/AuthenticationContext';

describe(App.name, () => {
    it('loads Setup screen when user is not stored', async () => {
        jest.spyOn(storage, 'getFromStorage').mockRejectedValueOnce("error");
        render(<App />);

        await waitFor(() => {
            expect(screen.getByTestId("setup-screen")).toBeOnTheScreen();
        });
    });

    it('loads Main screen when user is stored', async () => {
        jest.spyOn(storage, 'getFromStorage').mockResolvedValue("foo");
        render(<App />);

        await waitFor(() => {
            expect(screen.getByTestId("main-screen")).toBeOnTheScreen();
        });
    });
});
