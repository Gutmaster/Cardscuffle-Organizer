import React, {useState} from "react";
import {useFormik} from "formik";
import * as yup from "yup"

function SignUp({setUser}) {
    const [alertMessage, setAlertMessage] = useState('')
    const [alertClass, setAlertClass] = useState('positiveAlert')

    function alertReset(){
        setAlertMessage('')
    }

    function handleAlert(message, aClass){
        setAlertClass(aClass)
        setAlertMessage(message)
        setTimeout(alertReset, 2000)
    }
    
    const formSchema = yup.object().shape({
        username: yup.string().required("Please enter a username.").max(30),
        password: yup.string().required("Please enter a password.").max(30),
    })

    const formik = useFormik({
        validateOnChange : false,
        validateOnBlur : false,
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {
            try {
                const response = await fetch('/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: values.username,
                        password: values.password
                    }, null, 2)
                })
                if (!response.ok) {
                    // This block will catch non-200-level HTTP responses
                    const errorData = await response.json()
                    console.error('Validation error:', errorData)
                    handleAlert(errorData.message, 'negativeAlert')
                    return
                }
                const data = await response.json()
                setUser(data)
                formik.resetForm();
                handleAlert('User Added', 'positiveAlert')
            } catch (error) {
                // This block will catch network errors and other unexpected issues
                console.error('Network Error or unexpected issue:', error)
            }
        }
    })

    return (
        <div className='signUp'>
            <h1 className='title'>Sign Up</h1>
            <form onSubmit={formik.handleSubmit}>
                <label>
                    Username:
                    <input 
                        type="text" 
                        id = "username" 
                        name="username" 
                        value={formik.values.username} 
                        onChange={formik.handleChange}
                    />
                </label>
                <label>
                    Password:
                    <input 
                        type="password" 
                        id = "password" 
                        name="password" 
                        value={formik.values.password} 
                        onChange={formik.handleChange}
                    />
                </label>
                <button type="submit" className='submitButton'>Submit</button>
            </form>
            {alertMessage!==''? <p className={alertClass}>{alertMessage}</p>: <></>}
        </div>
    );
}

export default SignUp;