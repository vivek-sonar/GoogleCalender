import { useState, useEffect } from "react";
import Calendar from "./components/Calender";
import AddEvent from "./components/addevent";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";
import LandingPage from "./components/LandingPage";



export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  
    // <div className="min-h-screen  flex items-center justify-center p-6">
    //   <Calendar />
    // </div>






// const [user, setUser] = useState(null);

//   if (!user)
//     return (
//       <div>
//         <Login onLogin={setUser} />
//         <Register />
//       </div>
//     );

//   return <Chat user={user} />;




return(
   <div className="min-h-screen  flex items-center justify-center p-6  ">
    <LandingPage/>
  </div>
);







 
}