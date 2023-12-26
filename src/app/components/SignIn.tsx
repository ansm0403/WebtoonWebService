'use client'
import React, { MouseEvent, ChangeEvent, FormEvent, useState, useContext } from 'react'
import CloseButton from './ui/CloseButton';
import { LoginContext } from '../context/LoginContextProvider';
import { SERVER_URL } from '../models/globalVar';

type Props = {
    onClose : ()=>void
}
// 1. 로그인 userId, accessToken을 localStorage 에 저장.
// 2. useState(localStorage.get({userId, accessToken})) 상태 관리
// 3. 새로고침 할 때도 로그인 유지. (원래는 새로고침 할 때마다 로그인 정보를 가져와서 로그인 해야함. )
// 4. NavBar 는 로그인 되어있는 상태라면 userId를 받아와서 표시한다. 

export default function SignIn({onClose} : Props) {
    const [loginInfo, setLoginInfo] = useState({
        userId : "",
        password : "",
    })
    const {setIsLogin} = useContext(LoginContext);
   
    const handleUserId = (e : ChangeEvent<HTMLInputElement>) => {
        setLoginInfo((prevState)=>{
            return {...prevState, userId : e.target.value};
        })
    }
    const handlePassword = (e : ChangeEvent<HTMLInputElement>) => {
        setLoginInfo((prevState)=>{
            return {...prevState, password : e.target.value};
        })
    }

    async function logIn(e : MouseEvent<HTMLInputElement>){
        (
            async()=>{
                await fetch(`${SERVER_URL}/user/login`,{
                    method : 'POST',
                    headers : {
                        "Content-Type" : 'application/json',
                    },
                    body : JSON.stringify(loginInfo),
                })
                .then(res => res.json())
                .then(res => {
                    if(res){
                        localStorage.setItem('login-Status', JSON.stringify({
                            userId : res.userId,
                            accessToken : res.access_token
                        }));
                        setIsLogin(true);
                        onClose();
                    }
                })
                .catch(error => console.log(error.message))
            }
        )()
    }

    return (
        <div className = 'fixed w-full h-full top-0 left-0 bg-neutral-900/60 z-50'>
            <div className = 'absolute top-[20%] left-[35%] w-[500px] h-[300px] m-auto bg-white text-black rounded-xl p-5'>
                <form name = 'login' className = 'p-5 flex flex-col items-center'>
                    <input 
                        type = 'text' 
                        name = 'userId'
                        placeholder='아이디' 
                        className = 'p-2 shadow-sm mb-7'
                        onChange={handleUserId}
                    ></input>
                    <input 
                        type = 'password' 
                        name = 'password'
                        placeholder='비밀번호'
                        className= 'p-2 shadow-sm mb-10'
                        onChange={handlePassword}
                    ></input>
                    <input type='button' className='p-3 w-20 text-white rounded-lg bg-sky-500' value = '로그인' onClick = {logIn}/>
                </form>
            </div>
            <button onClick={onClose} className='fixed top-[10%] right-[15%]'>
                <CloseButton></CloseButton>
            </button>
        </div>
    )
}
