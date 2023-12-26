'use client'
import { useRouter } from 'next/navigation';
import React, { ButtonHTMLAttributes, ChangeEvent, useState, MouseEvent,FocusEvent, useRef } from 'react'
import { SERVER_URL } from '../models/globalVar';

const date = new Date()
const year = date.getFullYear();
const inputStyle = 'w-[70%] py-2 pl-3 rounded-md mb-5 text-black'
const buttonStyle = 'w-[100px] p-2 mt-10 m-auto border-[0.05rem] border-sky-200 rounded-lg'
const checkWarnStyle = 'text-red-700 bg-none pb-5 opacity-0 font-bold'
const format = {
    // 아이디는 첫글자가 소문자 영어이며 소문자,영어를 섞은 5~16 글자
    id : /^[a-z]+[a-z0-9]{5,16}$/,  
    // 비밀번호는 영어,숫자를 무조건 조합해야하며 소문자,대문자,숫자 조합의 6~16 글자
    password : /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,16}$/,         
    // 닉네임은 한글, 영어, 숫자를 조합한 2~12 글자
    nickname : /^[가-힣a-zA-Z0-9]{2,12}$/,                           
}

export default function SignUp() {

    const router = useRouter();
    const checkId = useRef<HTMLDivElement>(null);
    const checkPwd = useRef<HTMLDivElement>(null);
    const checkNickname = useRef<HTMLDivElement>(null);

    const [userInfo, setUserInfo] = useState({
        userId : "",
        password : "",
        nickName : "",
        gender : "",
        birthDate : "",
    })
    const [allCheck, setAllCheck] = useState<{[key : string]:boolean}>({
        userId : false,
        password : false,
        nickName : false,
    });
    const [pwdCheck, setPwdCheck] = useState<string>('');

    const handleUserId = (e:ChangeEvent<HTMLInputElement>) => {
        setUserInfo((prevState)=>{
            return {...prevState, userId : e.target.value}
        })
    }
    const handlePassword = (e:ChangeEvent<HTMLInputElement>) => {
        setUserInfo((prevState)=>{
            return {...prevState, password : e.target.value}
        })
    }
    const handleNickname = (e:ChangeEvent<HTMLInputElement>) => {
        setUserInfo((prevState)=>{
            return {...prevState, nickName : e.target.value}
        })
    }
    const handleGender = (e:ChangeEvent<HTMLInputElement>) => {
        setUserInfo((prevState)=>{
            return {...prevState, gender : e.target.value}
        })
    }
    const handleBirthDate = (e:ChangeEvent<HTMLInputElement>) => {
        setUserInfo((prevState)=>{
            return {...prevState, birthDate : e.target.value}
        })
    }

    async function handleIdCheck(e:FocusEvent<HTMLInputElement>){
        console.log("포커스 아웃!!!!!!!!")
        const res = await fetch(`${SERVER_URL}/user/check-id?userId=${userInfo.userId}`)
        if(res.ok === true && format.id.test(userInfo.userId)){
            (checkId.current as HTMLDivElement).style.setProperty('opacity','0')
            setAllCheck((prevState)=>{ return {...prevState, userId : true}})
        }
        else {
            (checkId.current as HTMLDivElement).style.setProperty('opacity','1')
            setAllCheck((prevState)=>{ return {...prevState, userId : false}})
        }
    }
    async function handleNickNameCheck(){
        const res = await fetch(`${SERVER_URL}/user/check-nickname?nickName=${userInfo.nickName}`)
        if(res.ok === true && format.nickname.test(userInfo.nickName)){
            (checkNickname.current as HTMLDivElement).style.setProperty('opacity','0')
            setAllCheck((prevState)=>{ return {...prevState, nickName : true}})
        }
        else {
            (checkNickname.current as HTMLDivElement).style.setProperty('opacity','1')
            setAllCheck((prevState)=>{ return {...prevState, nickName : false}})
        }
    }
    function handlePwdCheck(e:FocusEvent<HTMLInputElement>){
        if(pwdCheck === userInfo.password && format.password.test(userInfo.password)){
            (checkPwd.current as HTMLDivElement).style.setProperty('opacity', '0')
            setAllCheck((prevState)=>{ return {...prevState, password : true}})
        }
        else {
            (checkPwd.current as HTMLDivElement).style.setProperty('opacity', '1')
            setAllCheck((prevState)=>{ return {...prevState, password : false}})
        }
    }
    function infoAllCheck() : boolean{
        let check = false;
        for(const key in allCheck){
            if(allCheck[key] === false){
                check = false;
                break;
            } 
            check = true;
        }
        return check;
    } 

    const infoSubmit = (e :  MouseEvent<HTMLInputElement>) => {
        if(infoAllCheck()){
            (
                async()=>{
                    await fetch(`${SERVER_URL}/user/join`,{
                        method : 'POST',
                        headers : {
                            "Content-Type" : 'application/json',
                        },
                        body : JSON.stringify(userInfo),
                    })
                }
            )()
            router.push('/');
        }
        else window.alert("다시 입력하세요.");
    }


    return (
        <div className = 'p-5 mt-16 w-[450px] md:w-[600px] m-auto text-white transition-all duration-500'>
            <form className = 'flex flex-col' name = 'signup'>
                    <label>
                        <input type = 'text' name = 'userId' placeholder='아이디' className = {`${inputStyle}`} maxLength={16} required onChange={handleUserId} onBlur={handleIdCheck}/>
                        <div ref={checkId} className = {checkWarnStyle}> 사용할 수 없는 아이디입니다. 다시 입력해주세요.</div>
                    </label>
                    <input type = 'password' name = 'password' placeholder='비밀번호' className = {`${inputStyle}`} maxLength={20} required  onChange={handlePassword} onBlur={ handlePwdCheck}/>
                    <input type = 'password' placeholder='비밀번호 확인' className = {`${inputStyle}`} maxLength={20} required onChange={e=>setPwdCheck(e.target.value)} onBlur={handlePwdCheck}/>
                    <div ref={checkPwd} className={checkWarnStyle}>비밀번호가 일치하지 않습니다. 다시 입력해주세요.</div>
                    <label>
                        <input type = 'text' name = 'nickName' placeholder='닉네임' className = {`${inputStyle}`} maxLength={12} required  onChange={handleNickname} onBlur={handleNickNameCheck}/>
                        <div ref={checkNickname} className={checkWarnStyle}>사용할 수 없는 닉네임입니다. 다시 입력해주세요.</div>
                    </label>
                    <label className = 'mb-5'>
                        <input type = 'radio' name = 'gender' className = 'mr-3' value = 'MALE' onChange={handleGender} required/><label>남</label>
                       <input type = 'radio' name = 'gender' className = 'mr-3 ml-3' value = 'FEMALE' onChange={handleGender} required/> <label>여</label>
                    </label>
                    <label>
                        <label className = 'mr-3'>
                            생년월일
                            
                        </label>
                        <input 
                            type = 'date' 
                            name = 'birthDate' 
                            min={'1900-01-01'} 
                            max={`${year}-12-31`} 
                            className = 'p-1 ml-4 text-black rounded-md' 
                            required 
                            onChange={handleBirthDate}/>
                    </label>
                    <input type = 'button' className = {`${buttonStyle}`} value="가입"  onClick = {infoSubmit}/>
            </form>
        </div>
    )
}
