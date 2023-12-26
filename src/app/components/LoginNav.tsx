import React,{MouseEvent, useContext} from 'react'
import { LoginContext } from '../context/LoginContextProvider';
import { useRouter } from 'next/navigation';

export default function LoginNav() {
    const userId = JSON.parse(localStorage.getItem('login-Status') as string);
    const {setIsLogin} = useContext(LoginContext);
    const router = useRouter()

    const logout = (e:MouseEvent<HTMLButtonElement>) => {
        setIsLogin(false);
        localStorage.removeItem('login-Status');
        router.push('/');
    }
    return (
        <div className = 'flex flex-row gap-4'>
            <p className = 'p-4 text-white'><span className = 'text-red-700 font-bold'>{userId.userId}</span>님 어서오세요.</p>
            <button className = 'border-2 border-y-gray-100 rounded-md p-4' onClick={logout}>Logout</button>
        </div>
    )
}
