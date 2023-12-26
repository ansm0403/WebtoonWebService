'use client'

import Link from 'next/link'
import React, { useContext, useState } from 'react'
import SearchIcon from './ui/SearchIcon'
import ModalPortal from './ModalPortal'
import SignIn from './SignIn'
import Navigate from './Navigate'
import { usePathname } from 'next/navigation'
import NotLoginNav from './NotLoginNav'
import LoginNav from './LoginNav'
import { LoginContext } from '../context/LoginContextProvider'

async function getTest(){
  await fetch('http://localhost:9001/api/v1/webtoon/search?keyword="김부장"&genre="액션,"&week="화,"&page=0&size=1&sort="string" ')
  .then(res=>res.json())
  .then(res=>console.log(res))
}

export default function Navbar() {
  const [modal, setModal] = useState<boolean>(false)
  const path = usePathname();
  const {isLogin, setIsLogin} = useContext(LoginContext)

  return (
    <div className = "flex flex-row p-3 justify-between items-center">
            <Navigate href= "/" disabled={path==='/' && true}>
              <h1 className = "text-3xl font-bold text-white ml-4"> Webtoon </h1>
            </Navigate>        
        <nav className = "flex flex-row gap-4 mr-4  text-white">
            {/* <button onClick = {getTest} className = 'p-4 text-red-700'>눌러보소</button> */}
            <Navigate href= "/search" disabled={path==='/search' && true}>
              <SearchIcon></SearchIcon>
            </Navigate>
            {/* <Link className = "p-3 border-solid border-2 border-indigo-600 rounded-lg hover:opacity-60 hover:text-white" href = "/signup"> */}
            {
              isLogin
              ? <LoginNav></LoginNav>
              : <NotLoginNav path = {path} setModal = {setModal}></NotLoginNav>
            }
        </nav>
        {
          modal &&
          <ModalPortal>
            <SignIn onClose={()=>{setModal(false)}}></SignIn>
          </ModalPortal>
        }
    </div>
  )
}
