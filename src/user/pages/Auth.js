import React, {useState, useContext} from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import {useForm} from '../../shared/hooks/form-hook';
import {AuthContext} from '../../shared/context/auth-context';
import './Auth.css';
import ImageUpload from '../../shared/components/UIElements/ImageUpload'

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);

    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
        },
        false
    );

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    image: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false
                    },
                    image: {
                        value: null,
                        isValid: false
                    }
                },
                false
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    const authSubmitHandler = async event => {
        event.preventDefault();

        if (formState.isValid) {
            if (isLoginMode) {
                const body = JSON.stringify({
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                })

                try {
                    const r = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/users/signin`, {
                        method: 'POST',
                        body,
                        headers: {'Content-Type': 'application/json'}
                    })

                    if ((r && r.status === 200) || (r && r.status === 201)) {
                        const data = await r.json()
                        auth.login(data.userId, data.token)
                    } else {
                        throw new Error('Failed to sign in')
                    }

                } catch (e) {
                    console.log('Signing in Error: ', e.message)
                }

            } else {
                const formData = new FormData()
                formData.append('email', formState.inputs.email.value)
                formData.append('password', formState.inputs.password.value)
                formData.append('name', formState.inputs.name.value)
                formData.append('image', formState.inputs.image.value)

                try {
                    const r = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/users/signup`, {
                        method: 'POST',
                        body: formData
                    })

                    const data = await r.json()
                    if ((r && r.status === 200) || (r && r.status === 201)) {
                        auth.login(data.userId, data.token)
                    } else {
                        throw new Error('Failed to sign up')
                    }

                } catch (e) {
                    console.error('Signing up Error: ', e.message)
                }
            }
        }
    }

    return (
        <Card className="authentication">
            <h2>Login Required</h2>
            <hr/>
            <form onSubmit={authSubmitHandler}>
                {!isLoginMode && (
                    <Input
                        element="input"
                        id="name"
                        type="text"
                        label="Your Name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a name."
                        onInput={inputHandler}
                    />
                )}
                <Input
                    element="input"
                    id="email"
                    type="email"
                    label="E-Mail"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Please enter a valid email address."
                    onInput={inputHandler}
                />
                <Input
                    element="input"
                    id="password"
                    type="password"
                    label="Password"
                    validators={[VALIDATOR_MINLENGTH(6)]}
                    errorText="Please enter a valid password, at least 6 characters."
                    onInput={inputHandler}
                />
                {!isLoginMode && (
                    <ImageUpload center id={'image'} onInput={inputHandler} errorText={'Please, provide an image'} />
                )}
                <Button type="submit" disabled={!formState.isValid}>
                    {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                </Button>
            </form>
            <Button inverse onClick={switchModeHandler}>
                SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
            </Button>
        </Card>
    );
};

export default Auth;
