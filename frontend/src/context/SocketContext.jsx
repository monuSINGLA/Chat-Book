// SocketContext.js
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
    const user = useRecoilValue(userAtom);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    // console.log("Online Users:", onlineUsers);


    useEffect(() => {
        const socket = io("http://localhost:8000", {
            query: {
                userId: user?._id,
            },
        });

        setSocket(socket);

        socket.on("getOnlineUsers", (users) => {
            setOnlineUsers(users);
        });
        
        return () => socket.disconnect();
    }, [user?._id]);

    
    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
