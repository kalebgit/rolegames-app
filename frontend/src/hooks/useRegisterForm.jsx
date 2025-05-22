// src/hooks/useRegisterForm.jsx
import { useState } from 'react';
import api from "../api/axiosConfig";

export default function useRegisterForm(initialValue, onRegisterSuccess) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'PLAYER'
    });
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Todos los campos son obligatorios');
            return false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email no válido');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const registerData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                userType: formData.userType
            };

            const response = await api.post('/api/auth/register', registerData);
            
            setSuccess('Registro exitoso! Ya puedes iniciar sesión');
            
            // Opcionalmente realizar login automáticamente o pasar la información al componente padre
            if (onRegisterSuccess) {
                setTimeout(() => {
                    onRegisterSuccess(response.data);
                }, 1500);
            }
        } catch (err) {
            console.error('Error en registro:', err);
            setError(err.response?.data?.message || 'Error al registrar. Intenta con otro nombre de usuario o correo');
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        error,
        success,
        loading,
        handleChange,
        handleSubmit,
        setError,
        setSuccess
    };
}