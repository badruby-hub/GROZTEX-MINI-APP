"use client";
import AdminHeader from "./Header-admin";
import Header from "./Header";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function HeaderSwitcher() {
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(()=>{
      const tg = window.Telegram.WebApp;
      const chatId =  tg?.initDataUnsafe?.user?.id;

    if (!chatId) {
      setIsAdmin(false);
      return;
    }
    NProgress.start();
    fetch(`/api/user/admin`,{
        headers: {
    "X-User-ChatId": chatId.toString(),
  },
    })
    .then(res=>res.json())
    .then(data=>{
        setIsAdmin(data.isAdmin);
    })
    .catch(() => {
        setIsAdmin(false);
      })
    .finally(()=>{
       NProgress.done();
    })
    },[]);
      
  if (isAdmin === null) {
  return (
        <>
       <AdminHeader /> 
       <Header />
      </> ) ;
  }
  

}