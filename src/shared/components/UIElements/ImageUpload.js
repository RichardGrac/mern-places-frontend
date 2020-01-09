import React from 'react'
import './ImageUpload.css'
import Button from '../FormElements/Button'

const ImageUpload = props => {
    const [file, setFile] = React.useState()
    const [previewUrl, setPreviewUrl] = React.useState()
    const [isValid, setIsValid] = React.useState(false)
    const ref = React.useRef()

    React.useEffect(() => {
        if (!file) {
            return
        }
        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)

    }, [file])

    const pickHandler = (event) => {
        let pickedFile
        let fileIsValid = false
        if (event.target.files || event.target.files.length === 1) {
            pickedFile = event.target.files[0]
            setFile(pickedFile)
            fileIsValid = true
            setIsValid(fileIsValid)
        } else {
            setIsValid(false)
        }
        props.onInput(props.id, pickedFile, fileIsValid)
    }

    const pickImageHandler = () => {
        ref.current.click()
    }

    return (
        <div className={'form-control'}>
            <input type='file'
                   name={props.id}
                   id={props.id}
                   style={{display: 'none'}}
                   accept={'.jpg,.png,.jpeg'}
                   ref={ref}
                   onChange={(e) => pickHandler(e)}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload_preview'>
                    {previewUrl ? (
                        <img src={previewUrl} alt='Preview'/>
                    ) : (
                        <p>Please pick an image.</p>
                    )}
                </div>
                <Button type={'button'} onClick={pickImageHandler}>
                    Pick Image
                </Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    )
}

export default ImageUpload
