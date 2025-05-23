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
            
            // LOGGING SIMPLE PERO COMPLETO
            console.log("=== RESPUESTA COMPLETA ===");
            console.table({
                "Status": response.status,
                "Status Text": response.statusText,
                "Data Type": typeof response.data,
                "Data Keys": Object.keys(response.data).join(", ")
            });
            
            console.log("📄 response.data:", response.data);
            console.log("📋 response.headers:", response.headers);
            
            // Pretty print del JSON
            console.log("🎨 response.data formateado:");
            console.log(JSON.stringify(response.data, null, 2));
            
            if (response.data.token){
                localStorage.setItem('token', response.data.token)
                setSuccess('Login exitoso!')
                
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
                
                try {
                    const userResponse = await api.get('/api/users/me');
                    
                    console.log("✅ login exitoso, ejecutando onLoginSucess...")
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
            console.error('❌ ERROR:', err);
            console.error('📄 Error response data:', err.response?.data);
            console.error('📊 Error status:', err.response?.status);
            
            setError(err.response?.data?.message || 'Login fallido. Verifique que sus credenciales sean correctas')
        }finally{
            setLoading(false)
        }
    }
    return {credentials, error, success, loading, handleChange, handleSubmit}
}