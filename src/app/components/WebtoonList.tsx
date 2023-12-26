'use client'

import React, { useState, useEffect, useLayoutEffect, useContext } from 'react'
import { TempWebtoon, Webtoon, WebtoonListPage } from '../models/webtoonType'
import Card from './Card'
import Rank from './Rank'
import useSWR from 'swr'
import { WebtoonListContext } from '../context/WebtoonListContext'
import PageListNumber from './PageListNumber'

type Props = {
    webtoonList? : WebtoonListPage;
    isRank? : boolean;
}

const fetcher = (url : string) => fetch(url).then(res=>res.json());

const onePageCountWebtoon = 10;
const onePageCountPage = 10;

export default function WebtoonList({ webtoonList, isRank = false} : Props) {

  const {content, pageable : {pageNumber}} = webtoonList as WebtoonListPage;

  return (
    <div>
      <div className = "p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"> 
        {
          (content).map((webtoon, index)=>{
            return(
              <Card webtoon={webtoon}>
                {
                  isRank &&
                  <Rank rank={(index+1)+(pageNumber*10)}/>
                }
              </Card>
            )
          })
        }    
      </div>
    <PageListNumber ListPageInfo={webtoonList as WebtoonListPage}></PageListNumber>
    </div>
  )
}
