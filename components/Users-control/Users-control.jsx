import { useEffect, useState } from "react"
import classes from "./users.module.css";
import Loader from "../Loader/Loader";
import toast from "react-hot-toast";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import BtnBackHome from "../Button/BtnBackHome";
import Sletter from "../Users-control/newsletter/Newsletter";



export default function UsersControl() {
 const [result, setResult] = useState([]);
 const [search, setSearch] = useState("");
 const [debouncedSearch, setDebouncedSearch] = useState("");
 const [isLoading, setIsLoading] = useState(false);
 const [visible, setVisible] = useState(null);
    
    useEffect(() => {
      const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 600); // 600 мс пауза

    return () => {
      clearTimeout(handler);
    };
  }, [search]);


    useEffect(()=>{
      const tg = window.Telegram.WebApp;
      tg.BackButton.show();

      const btnBackClick =()=>{
        window.history.back();
      } 
       tg.BackButton.onClick(btnBackClick);

 
       
           async function users() {
        try {
             const chatId = tg.initDataUnsafe?.user?.id;
            setIsLoading(true);
            const response = await fetch(`/api/user?chatId=${chatId}`,{
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Ошибка инициализации:", error);
        } finally{
            setIsLoading(false);
            
        }
    }
    users();
         return () => {
         tg.BackButton.hide();
         tg.BackButton.offClick(btnBackClick);
         };

    },[]);


   
     const flagSwitch = async (user) => {
  try {
    const chatId = window.Telegram.WebApp.initDataUnsafe?.user?.id;

    if (!chatId) {
      toast.error("Chat ID не найден");
      return;
    }

    NProgress.start();

    await fetch(`/api/user/admin?chatId=${chatId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId: user.chatId }),
    });

    const response = await fetch(`/api/user?chatId=${chatId}`);
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Ожидался массив пользователей");
    }

    setResult(data);

    toast.success(
      user.isAdmin
        ? "Права администратора удалены"
        : "Права администратора выданы"
    );
  } catch (error) {
    toast.error("Ошибка обновления прав");
    console.error(error);
  } finally {
    NProgress.done();
  }
};

const superAdmins = (process.env.NEXT_PUBLIC_SUPER_ADMIN_CHAT_IDS || "")
  .split(",")
  .map(id => id.trim());

const getUserRoleLabel = (user) => {
  if (superAdmins.includes(user.chatId.toString())) {
    return "Глобальный администратор";
  }
  if (user.isAdmin) {
    return "Администратор";
  }
  return "Клиент";
};

  const filteredUsers = result?.filter((user) => {
    const query = debouncedSearch.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.userName?.toLowerCase().includes(query) ||
      user.chatId?.toString().includes(query)
    );
  });

    return  <div className={classes.container__users}>
         <h1 className={classes.zagolovok}>Карточки пользователей</h1>
         <h3 className={classes.zagolovok__search}>поиск пользователей</h3>
         <input 
         className={classes.search__input} 
         type="search"
         maxLength="15" 
         value={search} 
         onChange={(e) => setSearch(e.target.value)}
         placeholder="Введите данные пользователя"/>
         <hr />
          <div className={classes.block__count__users}><h4>Пользователей:<span className={classes.count__users}>{result.length}</span> </h4><Sletter/></div>
          
          <div className={classes.block__cards}>
         {isLoading? <Loader/> : filteredUsers.map((user)=>{
         return <div className={classes.card} key={user.id}>
      <div className={classes.cardHeader}>
        <span className={classes.role}>
          {getUserRoleLabel(user)}: <span className={classes.userName}>@{user.userName || "Пусто"}</span>  
        </span>
        <div>{!superAdmins.includes(user.chatId.toString()) && (  
            <>
         <ol onClick={()=>{setVisible(prev => (prev === user.id ? null : user.id))}} className={classes.btn__menu}>
          <li>•</li>
          <li>•</li>
          <li>•</li>
        </ol>
       { visible === user.id && <div className={classes.block__menu}>
        <button onClick={()=>{flagSwitch(user), setVisible(null)}} className={classes.btn__give}>{user.isAdmin ? "Удалить права": "Дать права"}</button>
        <button onClick={()=>{setVisible(null)}} className={classes.add__block}>Заблокировать</button>
          </div>}
             </>
         )}
        </div>
      </div>
      <div className={classes.block__main}>
      <div className={classes.cardBody}>
        <div className={classes.id}><strong>id:</strong> {user.id}</div>
        <div className={classes.firstName}><strong>Имя:</strong> {user.firstName || "Пусто"}</div>
        <div className={classes.lastName}><strong>Фамилия:</strong> {user.lastName || "Пусто"}</div>
        <div className={classes.chatId}><strong>Chat ID:</strong> {user.chatId}</div>
        <div className={classes.is_deleted_bot}><strong>Удален бот:</strong> {user?.isDeletedBot ? "Да" : "Нет"}</div>
               
        </div>
            
      </div>
    </div>
 })

} </div> 
{!isLoading && <BtnBackHome/>} </div>
}