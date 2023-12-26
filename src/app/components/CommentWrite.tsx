'use client'
import React, { Dispatch, FormEvent, SetStateAction, MouseEvent, useState, useEffect, useContext } from 'react'
import { SERVER_URL } from '../models/globalVar';
import { CommentContext } from '../context/CommentContextProvider';

interface Props {
  // setCommentModal : Dispatch<SetStateAction<boolean>>
  setCommentModal : () => void;
  webtoonId : number;
  method : {
    method : string,
    url : string,
  }
}

export default function CommentWrite({setCommentModal, webtoonId, method} : Props) {
  const [comment, setComment] = useState<{[key : string] : string}>({comment : ''})
  const {isChange, setIsChange} = useContext(CommentContext);
  const loginStatus = JSON.parse(localStorage.getItem('login-Status') as string)

  async function commentSubmit(e:MouseEvent<HTMLButtonElement>){
    e.preventDefault();
    const response = await fetch(`${SERVER_URL}/comment/${method.url}/${webtoonId}`,{
                        method : `${method.method}`,
                        headers : {
                          "Content-Type" : 'application/json',
                          Authorization : loginStatus["accessToken"],
                        },
                        body : JSON.stringify(comment)
                    })
                    .then(res=>res.json)
                    .then(res=>{
                      console.log("댓글 전송 완료!")
                      setCommentModal();
                      setIsChange(true);
                    })
                    .catch(error => console.log("댓글 전송 실패! ", error.message))
  }
  
  return (
    <div className = "fixed top-[20%] left-0 w-full h-full">
        <div className = "m-auto p-6 w-[450px] h-[300px] border-gray-400 border-2 bg-white ">
            <form>
              <textarea
                className = 'w-full h-[200px] p-2 rounded-xl border-[#eee] border-2'
                placeholder = '댓글을 작성해주세요.'
                required
                value={comment.comment}
                onChange={e=>setComment({comment : e.target.value})}
              />

              <button type = "submit"
                      className = "rounded-md w-[15%] p-1 mr-4 mt-3 text-white bg-sky-300 border-sky-300 border-2 hover:opacity-[60%]"
                      onClick={commentSubmit}>        
                    작성
              </button>
              <button 
                className = "rounded-md w-[15%] p-1 border-gray-300 bg-gray-300 border-2 hover:opacity-[60%]"
                onClick={(e)=>{setCommentModal()}}>
                    취소
              </button>
            </form>
        </div>
    </div>
  )
}

