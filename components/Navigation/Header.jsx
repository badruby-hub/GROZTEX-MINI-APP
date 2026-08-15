"use client";
import Link from "next/link";
import classes from "./header.module.css"

import { useEffect } from "react";



export default function Header() {
   useEffect(()=>{
      const tg = window.Telegram.WebApp;
       tg.expand();
       tg.ready();
   },[]);

   const onClose =()=>{
    const tg = window.Telegram.WebApp;
          tg.close()
    }

     
     return<section className={classes.block__content__home}>
        <nav className={classes.App}>
          <div className={classes.logo}><div className={classes.logo__name}>{/*<div className={classes.shadow}></div>*/}GROZ
             <svg className={classes.tether} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" height="80" viewBox="0 0 48 48">
             <polygon fill="#56b298" points="24,44 2,22.5 10,5 38,5 46,22.5"></polygon>
             <path fill="#fff" d="M38,22c0-1.436-4.711-2.635-11-2.929V16h8v-6H13v6h8v3.071C14.711,19.365,10,20.564,10,22
             s4.711,2.635,11,2.929V36h6V24.929C33.289,24.635,38,23.436,38,22z M24,24c-6.627,0-12-1.007-12-2.25c0-1.048,3.827-1.926,9-2.176
             v3.346c0.96,0.06,1.96,0.08,3,0.08s2.04-0.02,3-0.08v-3.346c5.173,0.25,9,1.128,9,2.176C36,22.993,30.627,24,24,24z"></path>
             </svg>EX</div>
             <div className={classes.logo__title}>best exchange</div></div>
            <ul className={classes.ul}>
               <li className={`${classes.exchange} ${classes.li}`}>
                  <Link className={classes.link} href="/exchange">Купить/Продать USDT</Link>
               </li>
               <li className={`${classes.about} ${classes.li}`}>
                  <Link className={classes.link} href="/about">О нас</Link>
               </li>
               <li className={`${classes.requests} ${classes.li}`}>
                  <Link className={classes.link} href="/requests">Все заявки</Link>
               </li>
               <li className={`${classes.support} ${classes.li}`}>
                  <Link className={classes.link} href="/support">Поддержка</Link>
               </li>
               <li className={`${classes.valuation} ${classes.li}`}>
                  <Link className={classes.link} href="/valuation">Курс</Link>
               </li>
               <li onClick={onClose} className={`${classes.close} ${classes.li}`}><div className={classes.btn__close}>Закрыть приложение</div></li>
            </ul>
            <div >
         <div className={classes.our__the__map}>
          <Link className={classes.link__map} href="https://yandex.ru/maps/?um=constructor%3A8ccd5e2afac188c83b586644c5650dda76028d21759b34e8f334082e1c76b5b7&amp;source=constructorStatic" target="_blank">
         <div className={classes.text__address}> Наш адрес: Малгобекская улица, 19</div>
         <img className={classes.img__map} rel="preload" src="https://api-maps.yandex.ru/services/constructor/1.0/static/?um=constructor%3A8ccd5e2afac188c83b586644c5650dda76028d21759b34e8f334082e1c76b5b7&amp;width=350&amp;height=150&amp;lang=ru_RU"
          alt="" style={{border: 0}} /></Link></div>
         </div>

        </nav>
     </section>
}