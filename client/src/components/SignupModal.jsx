import React, {useState} from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import {Modal, Button, Form} from 'react-bootstrap';
import Auth from '../utils/auth';

const SignupModal = ({show, handleClose}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
       
    const [addUser, {error, data}]= useMutation(ADD_USER);    

    const handleSignup = async(e) => {
        e.preventDefault();
        
        try{
            const {data} = await addUser({
                variables: {name, email, password}
            });
            console.log({data});
            Auth.login(data.addUser.token);            
            localStorage.setItem('verificationStartTime', String(Date.now()));            
        }catch(err){
            console.error(err);
        }

        setName('');
        setEmail('');
        setPassword(''); 
    };    

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create Your Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId='formName'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                        type='text'
                        placeholder='Enter your name'
                        value={name}
                        onChange={(e)=> setName(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='formEmail'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                        type='email'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='formPassword'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                        type='password'
                        placeholder='Enter a password with at least 8 characters'
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant='primary' onClick={handleSignup}>
                    Create Account
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default SignupModal;