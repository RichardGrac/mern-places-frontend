import React from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import {useForm} from '../../shared/hooks/form-hook';
import './PlaceForm.css';
import {withRouter} from 'react-router-dom'
import {AuthContext} from '../../shared/context/auth-context'
import ImageUpload from '../../shared/components/UIElements/ImageUpload'

const NewPlace = (props) => {
    const auth = React.useContext(AuthContext);
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
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

    const placeSubmitHandler = async event => {
        event.preventDefault();
        try {
            if (formState.isValid) {
                const formData = new FormData()
                formData.append('title', formState.inputs.title.value)
                formData.append('description', formState.inputs.description.value)
                formData.append('address', formState.inputs.address.value)
                formData.append('image', formState.inputs.image.value)

                const r = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/places`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': 'Bearer ' + auth.userToken
                    }
                })

                if (r && r.status === 201) {
                    props.history.push(`/${auth.userId}/places`)
                } else {
                    const data = await r.json()
                    throw new Error(data.message)
                }
            }
        } catch (e) {
            alert(e.message)
        }
    };

    return (
        <form className="place-form" onSubmit={placeSubmitHandler}>
            <Input
                id="title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title."
                onInput={inputHandler}
            />
            <Input
                id="description"
                element="textarea"
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (at least 5 characters)."
                onInput={inputHandler}
            />
            <Input
                id="address"
                element="input"
                label="Address"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid address."
                onInput={inputHandler}
            />
            <ImageUpload id={'image'} onInput={inputHandler} errorText={'Please, provide an image'} />
            <Button type="submit" disabled={!formState.isValid}>
                ADD PLACE
            </Button>
        </form>
    );
};

export default withRouter(NewPlace)
