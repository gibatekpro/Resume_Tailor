import React, {useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import * as Yup from "yup";
import {Formik} from "formik";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import {useAuth} from "../../context/auth/AuthProvider";
import {appName} from "../../data/applicationData";

export const ResetPasswordPage: React.FC = () => {
    window.scroll(0, 0);
    const [resetFailed, setResetFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    //handleSubmit function handles form submission
    async function handleSubmit(values: { email: string;}) {
        try {
            //Call the password reset function with email only
            await auth?.resetPassword(values.email, (message: string) => {
                console.log(message);
                alert(message)
                const from = (location.state as any)?.from?.pathname || "/login";
                navigate(from, { replace: true });
            });
        } catch (error) {
            console.log("An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    const ResetSchema = Yup.object().shape({
        email: Yup.string()
            .required('Required')
            .matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, {
                message: 'Email does not match expected pattern'
            }),
    });
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: "900px",
        }}>
            <div style={{
                display: "flex",
                marginTop: "50px",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    validationSchema={ResetSchema}
                    onSubmit={async (values) => {
                        setIsLoading(true);
                        await new Promise((r) => setTimeout(r, 500));
                        handleSubmit(values);
                    }}>
                    {({handleSubmit, handleChange, values, touched, errors}) => (
                        <Form noValidate
                              onSubmit={handleSubmit}
                              style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  flexGrow: 1,
                                  maxWidth: "400px",
                                  width: "100%",
                                  padding: "20px",
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                  borderRadius: "8px",
                                  backgroundColor: "#fff"
                              }} className="bg-body-tertiary">
                            <a className="logo text-center fs-3" href="/public">{appName}</a>
                            <hr/>
                            <h6 className="text-center mt-2">Reset Password</h6>
                            <hr className="mb-5"/>
                            <h6 className="text-center" hidden={!isLoading}>
                                <div className="spinner-border text-primary " role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </h6>
                            <h6 className="text-center" style={{color: "red"}} hidden={(isLoading) || (!isLoading && !resetFailed)}>Details incorrect or user unverified</h6>
                            <Row className="mb-3">
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            isValid={touched.email && !errors.email}
                                            isInvalid={errors.email != null}
                                        />
                                        <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Row>
                            <Button className="hard-button blue" type="submit" disabled={isLoading}>Submit</Button>
                            <br/>
                            <div className="d-flex justify-content-between">
                                <small style={{fontStyle: 'italic'}}><Link to="/login">Sign in</Link></small>
                            </div>
                            <div className="d-flex justify-content-between" style={{
                                minHeight: '20px'
                            }}>
                            </div>
                            <div className="d-flex justify-content-between" style={{
                                minHeight: '20px'
                            }}>
                                <small>Don't have an account? <Link to="/register">Register</Link></small>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );

}