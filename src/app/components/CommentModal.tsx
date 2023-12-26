'use client'
import { comment } from 'postcss';
import React, { useContext, useState } from 'react'
import CommentWrite from './CommentWrite';
import ModalPortal from './ModalPortal';
import { LoginContext } from '../context/LoginContextProvider';
import LoginAlert from './LoginAlert';
import SignIn from './SignIn';

type Props = {
  webtoonId : number;
}

export default function CommentModal({webtoonId} : Props) {
  const [modal, setModal] = useState<boolean>(false);
  const [alertModal, setAlertModal] = useState<boolean>(false);
  const {isLogin} = useContext(LoginContext);

  const modalClose = () => {
    setModal(false)
  }
  const alertModalClose = () => {
    setAlertModal(true)
  }
  return (
    <div className = "relative flex col-start-1 col-end-3 justify-between">
      <p className = "pt-5">Comment</p>
      <button 
        className = "p-5 rounded-lg hover:opacity-40"
        onClick = {()=>{setModal(true)}}
      >작성하기</button>
        <ModalPortal>
          {
            (modal && isLogin) &&
            <CommentWrite setCommentModal={modalClose} webtoonId={webtoonId} method={{method : "POST", url : "create"}}></CommentWrite>
          }
          {/* {
            (!modal || !isLogin) && 
            <LoginAlert onClose={modalClose}></LoginAlert>
          } */}
        </ModalPortal>
    </div>
  )
}

