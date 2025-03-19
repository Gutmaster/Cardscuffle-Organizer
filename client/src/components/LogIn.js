import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as yup from "yup"
import UserContext from "./context/user";

function LogIn() {
    const [alertMessage, setAlertMessage] = useState('');
    const [alertClass, setAlertClass] = useState('postiveAlert');
    const {setUser} = useContext(UserContext);
    const navigate = useNavigate();

    function alertReset(){
        setAlertMessage('')
    }

    function handleAlert(message, aClass){
        setAlertClass(aClass)
        setAlertMessage(message)
        setTimeout(alertReset, 3000)
    }

    const formSchema = yup.object().shape({
        username: yup.string().required("Please enter a username.").max(30),
        password: yup.string().required("Please enter a password.").max(30),
    });

    const formik = useFormik({
        validateOnChange : false,
        validateOnBlur : false,
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: formSchema,
        validate: (values) => {
            // Use Yup's validation method
            const validationErrors = {};
            try {
              formSchema.validateSync(values, { abortEarly: false });
            } catch (err) {
              err.inner.forEach((error) => {
                validationErrors[error.path] = error.message;
              });
            }
      
            // Set a timer to clear errors after 3 seconds
            if (Object.keys(validationErrors).length > 0) {
              setTimeout(() => {
                formik.setErrors({});
              }, 3000);
            }
      
            return validationErrors;
        },
        onSubmit: async (values) => {
            try {
                const response = await fetch('/login', {
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
                    const errorData = await response.json();
                    handleAlert(errorData.error, 'negativeAlert');
                    return;
                }
                const data = await response.json();
                setUser(data);
                formik.resetForm();
                navigate('/usercards');
            } catch (error) {
                // This block will catch network errors and other unexpected issues
                console.error('Network Error or unexpected issue:', error);
            }
        }
    });

    return (
        <div className='signUp'>
            <h1 className='title'>Log In</h1>
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
                {formik.errors.username ? <div className="error">{formik.errors.username}</div> : null}
        
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
                {formik.errors.password ? <div className="error">{formik.errors.password}</div> : null}
                <button type="submit" className='submitButton'>Submit</button>
            </form>
            {alertMessage !== '' ? <p className={alertClass}>{alertMessage}</p> : null}
        </div>
      );
}

export default LogIn;