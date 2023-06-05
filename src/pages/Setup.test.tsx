import * as github from '../services/github';
import * as usersAPI from '../services/users';

import { AuthenticationContext, AuthenticationContextObject } from '../context/AuthenticationContext';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { Alert } from 'react-native';
import { AxiosError } from 'axios';
import Setup from './Setup';

describe(Setup.name, () => {
    it('shows error if username is not on GitHub', async () => {
        const { input, button } = setUp();
        const alertSpy = jest.spyOn(Alert, 'alert');
        jest.spyOn(github, 'getUserInfo').mockRejectedValueOnce({
            isAxiosError: true,
            response: { status: 404 },
        } as AxiosError);

        fireEvent.changeText(input, 'foo');
        fireEvent.press(button);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('There is no such username on GitHub.');
        });
    });

    describe('when username is on GitHub', () => {
        let postUserSpy: jest.SpyInstance;
        beforeEach(() => {
            jest.spyOn(github, 'getUserInfo').mockResolvedValue({});
            postUserSpy = jest.spyOn(usersAPI, 'postUser').mockResolvedValue({} as any)
        });

        it('POSTs user to API', async () => {
            const { input, button } = setUp();

            fireEvent.changeText(input, 'foo');
            fireEvent.press(button);

            await waitFor(() => {
                expect(postUserSpy).toHaveBeenCalled();
            });
        });

        it('shows error if users API is unavailable', async () => {
            const { input, button } = setUp();
            const alertSpy = jest.spyOn(Alert, 'alert');
            postUserSpy.mockRejectedValue('Foo Error');

            fireEvent.changeText(input, 'foo');
            fireEvent.press(button);

            await waitFor(() => {
                expect(alertSpy).toHaveBeenCalledWith('Foo Error');
            });
        });

        it('sets AuthenticationContext value', async () => {
            const setAuthenticationContextMock = jest.fn();
            const { input, button } = setUp({ value: null, setValue: setAuthenticationContextMock });

            fireEvent.changeText(input, 'foo');
            fireEvent.press(button);

            await waitFor(() => {
                expect(setAuthenticationContextMock).toHaveBeenCalledWith("foo");
            });
        });
    });

    function setUp(authenticationContext?: AuthenticationContextObject) {
        const mockProps = {} as any;
        render(
            <AuthenticationContext.Provider value={authenticationContext || null}>
                <Setup {...mockProps} />
            </AuthenticationContext.Provider>
        );

        return {
            input: screen.getByTestId('input'),
            button: screen.getByTestId('button'),
        };
    }
});
