import React, {useEffect, useState} from 'react';
import {useParams, withRouter} from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import {useForm} from '../../shared/hooks/form-hook';
import './PlaceForm.css';
import {AuthContext} from '../../shared/context/auth-context'

const UpdatePlace = (props) => {
    const [loading, setLoading] = useState(true);
    const [currentPlace, setCurrentPlace] = useState({})
    const auth = React.useContext(AuthContext);
    const placeId = useState(useParams().placeId)[0]

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        },
        false
    );

    useEffect(() => {
        getPlace()
    }, [])

    const getPlace = async () => {
        const r = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/places/${placeId}`)
        if (r) {
            const data = await r.json()
            if (data.place) {
                setFormData(
                    {
                        title: {
                            value: data.place.title,
                            isValid: true
                        },
                        description: {
                            value: data.place.description,
                            isValid: true
                        }
                    },
                    true
                )

                setLoading(false)
                setCurrentPlace(data.place)
            }
            else setCurrentPlace(null)
        }
    }

    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        if (formState.isValid) {
            const r = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/places/${placeId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.userToken
                },
                body: JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                })
            })
            if (r && r.status === 201) {
                props.history.push(`/${auth.userId}/places`)
            }
        }
    };

    if (loading) {
        return (
            <div className="center">
                <h2>Loading...</h2>
            </div>
        );
    }

    if (!currentPlace) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }

    return (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
            <Input
                id="title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title."
                onInput={inputHandler}
                initialValue={formState.inputs.title.value}
                initialValid={formState.inputs.title.isValid}
            />
            <Input
                id="description"
                element="textarea"
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (min. 5 characters)."
                onInput={inputHandler}
                initialValue={formState.inputs.description.value}
                initialValid={formState.inputs.description.isValid}
            />
            <Button type="submit" disabled={!formState.isValid}>
                UPDATE PLACE
            </Button>
        </form>
    );
};

export default withRouter(UpdatePlace);
