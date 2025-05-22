import {useState} from 'react'
import api from "../api/axiosConfig"

export default function useLoginForm(initialValue, onLoginSuccess){
    const [credentials, setCredentials] = useState({
        username: '', 
        password: ''
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) =>{
        const {name, value} = e.target
        setCredentials(prev=>({...prev, [name]: value}))
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')
        try{
            const response = await api.post('api/auth/login', credentials)
            
            if (response.data.token){
                localStorage.setItem('token', response.data.token)
                setSuccess('Login exitoso!')
                
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
                
                try {
                    const userResponse = await api.get('/api/users/me');
                    
                    if (onLoginSuccess) {
                        onLoginSuccess(userResponse.data);
                    }
                } catch (userError) {
                    console.error('Error al obtener datos del usuario:', userError);
                    if (onLoginSuccess) {
                        onLoginSuccess({ username: credentials.username });
                    }
                }
            }
        }catch(err){
            console.error('Login error: ', err)
            setError(err.response?.data?.message || 'Login fallido. Verifique que sus credenciales sean correctas')
        }finally{
            setLoading(false)
        }
    }
    return {credentials, error, success, loading, handleChange, handleSubmit}
}