import {useState} from 'react'
import axios from 'axios'

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
            const response = await axios.post('http://localhost:8080/api/auth/login', credentials)
            
            if (response.data.token){
                localStorage.setItem('token', response.data.token)
                setSuccess('Login exitoso!')
                
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
                
                const userResponse = await axios.get('http://localhost:8080/api/users/me')
                
                if(onLoginSuccess){
                    onLoginSuccess(userResponse.data)
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