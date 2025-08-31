import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [ form, setForm ] = useState({ email: '', firstname: '', lastname: '', password: '' });
    const [ submitting, setSubmitting ] = useState(false);
    const navigate = useNavigate();


    function handleChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [ name ]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        console.log(form);

        axios.post("https://cohort-1-project-chat-gpt.onrender.com/api/auth/register", {
            email: form.email,
            fullName: {
                firstName: form.firstname,
                lastName: form.lastname
            },
            password: form.password
        }, {
            withCredentials: true
        }).then((res) => {
            console.log(res);
            navigate("/");
        }).catch((err) => {
            console.error(err);
            alert('Registration failed (placeholder)');
        })

        try {
            // Placeholder: integrate real registration logic / API call.

        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className='main'>
        <div className="center-min-h-screen">
            <div className="auth-wrap">
                <div className="brand">
                    <h1>NeoBot</h1>
                    <p>Talk Smart. Think Faster.</p>
                </div>
                <div className="auth-card" role="main" aria-labelledby="register-heading">
                    <header className="auth-header">
                        <h2 id="register-heading">Get Started</h2>
                    </header>
                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    <div className="field-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" autoComplete="email" placeholder="abc@example.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="grid-2">
                        <div className="field-group">
                            <label htmlFor="firstname">First name</label>
                            <input id="firstname" name="firstname" placeholder="Arjul" value={form.firstname} onChange={handleChange} required />
                        </div>
                        <div className="field-group">
                            <label htmlFor="lastname">Last name</label>
                            <input id="lastname" name="lastname" placeholder="Rao" value={form.lastname} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="field-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" autoComplete="new-password" placeholder="Create a password" value={form.password} onChange={handleChange} required minLength={6} />
                    </div>
                        <button type="submit" className="primary-btn" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create Account'}
                        </button>
                </form>
                <p className="auth-alt">Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Register;
