'use client'

import React, { useEffect, useState } from 'react'
import WebtoonList from '../components/WebtoonList';
import { WebtoonListPage } from '../models/webtoonType';
import { useSearchParams } from 'next/navigation';
import { SERVER_URL } from '../models/globalVar';

export default function RankPage() {
  const [webtoonList, setWebtoonList] = useState<WebtoonListPage>();

  const searchParams = useSearchParams()
  const search = searchParams.get('page');

  useEffect(()=>{
    if(search === null){
    ( async()=>{
      await fetch(`${SERVER_URL}/webtoon/list?&page=0`, 
                  {method : "GET"}
      )
      .then(res=>res.json())
      .then(res=>setWebtoonList(res))
    })()
    }
  },[])

  useEffect(()=>{
    if(Number(search) > 0){
      ( async()=>{
        await fetch(`${SERVER_URL}/webtoon/list?&page=${search}`, 
                    {method : "GET"}
        )
        .then(res=>res.json())
        .then(res=>setWebtoonList(res))
      })()
    }
  },[search])

  
  useEffect(()=>{
    console.log('데이터는???', webtoonList);
  },[webtoonList])

  return (
    <>
      {
        (webtoonList)  &&
        <WebtoonList webtoonList={webtoonList} isRank={true}></WebtoonList>
      }
    </>
  )
}
 