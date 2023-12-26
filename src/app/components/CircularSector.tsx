'use client'

import React, { MouseEventHandler, MouseEvent, useState, useEffect, useRef, RefObject, useContext } from 'react'
import styles from "./sector.module.css"
import "../../app/globals.css"
import { WebtoonThum } from '../service/webtoonInfo'
import Link from 'next/link'
import TransitionContext from '../context/TransitionContext'
import gsap from 'gsap'
import { LOADING_STATES, NavigationContext, useNavigationContext } from '../context/NavigationContext'
import Navigate from './Navigate'

const mainCircle = [
    '검색', 
    '신작 웹툰', 
    '웹툰 랭킹', 
    '장르별 웹툰보기', 
    '웹툰 추천받기',
]

type Props = {
    sectorNum : number,
    thumnails : WebtoonThum[],
    pageUrl : string[]
}
let circleRef : RefObject<HTMLDivElement>


export default function CircularSector({sectorNum, thumnails, pageUrl} : Props) {

    const sectorOpacity : boolean[] = [];
    const sectorSkew : boolean[] = [];
    let skewExp = (10*sectorNum-32);
    let rotateExp = (0+(360/sectorNum));
    circleRef = useRef<HTMLDivElement>(null);

    for(let i = 0; i < sectorNum; i++){ 
        sectorOpacity.push(false) 
        sectorSkew.push(false)
    }

    let [sectorOpacityState, setSectorOpacityState] = useState<boolean[]>(sectorOpacity);
    let [sectorSkewState, setSectorSkewsState] = useState<boolean[]>(sectorSkew)

    const mouseOver = (e : MouseEvent<HTMLDivElement>, sectorListIndex : number) => {

        const newSectorOpacityState = sectorOpacityState.map((sectorState, index)=>{
            return sectorListIndex !== index ? sectorState = true : sectorState = false
        })
        const newSectorSkewState = sectorSkewState.map((sectorState, index)=>{
            return sectorListIndex === index ? sectorState = true : sectorState = false 
        })
        const sectors = document.querySelectorAll<HTMLElement>('.sector');
        sectors[sectorListIndex].style.transform = `rotate(${rotateExp*sectorListIndex-15}deg) skew(${skewExp-20}deg)`
        sectors[sectorListIndex].style.zIndex = `${sectorNum}`
        
        setSectorOpacityState([...newSectorOpacityState])
        setSectorSkewsState([...newSectorSkewState])
    }
    const mouseOut = (e : MouseEvent<HTMLDivElement>, sectorListIndex : number) => {

        const newSectorOpacityState = sectorOpacityState.map((sectorState, index)=>{
            return sectorState = false;
        })
        const newSectorSkewState = sectorSkewState?.map((sectorState, index)=>{
            return sectorState = false;
        })
        const sectors = document.querySelectorAll<HTMLElement>('.sector');
        sectors[sectorListIndex].style.transform = `rotate(${rotateExp*sectorListIndex}deg) skew(${skewExp}deg)`
        sectors[sectorListIndex].style.zIndex = `${sectorListIndex}`

        setSectorOpacityState([...newSectorOpacityState])
        setSectorSkewsState([...newSectorSkewState])
    }
   

    return (
        <div className = "circle items-center mt-10 text-center" ref={circleRef}>
            <div className = "wrapper m-auto">
                {
                    thumnails.map((thumnail, i)=>{
                        return(
                            <Navigate href = {pageUrl[i]}>
                                <div key = {i} className = {`sector ${(sectorOpacityState[i] === true) && 'hoverOpacity'}`}
                                    style = {{
                                        transform : `
                                            rotate(${rotateExp*i}deg) 
                                            skewX(${skewExp}deg)
                                        `,
                                        backgroundImage : `url(/images/${thumnail.thumnail})`,
                                        zIndex : `${i}`
                                    }}
                                    onMouseOver={(e)=>{mouseOver(e, i)}}
                                    onMouseOut={(e)=>{mouseOut(e, i)}}
                                >
                                    {/* <p className = "relative top-[90%] text-right align-text-bottom">{mainCircle[i]}</p> */}
                                </div>
                            </Navigate>
                         )
                    })
                }
            </div>
        </div>
    )
}
// export function circleInit(){
//     console.log("Initalized Loading Component");
//     /*Add your initial state here */
//     gsap.set(circleRef.current, {
//       clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
//     });
// }
// export function circleEnter(){
//     console.log("Performing Loading in");
//     /*Add your page enter animation*/
//     gsap.to(circleRef.current, {
//       clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
//       duration: 1,
//       ease: "power3.inOut",
//     });
// }
// export function circleExit(){
//     const {loading, setLoading} = useNavigationContext();
//     console.log("Performing Loading out");
//     /*Add your page exit animations*/
//     gsap.to(circleRef.current, {
//       clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
//       duration: 1,
//       ease: "power3.inOut",
//       onComplete: () => {
//         if (loading === LOADING_STATES.INIT) setLoading(LOADING_STATES.LOADED);
//       },
//     });
// }