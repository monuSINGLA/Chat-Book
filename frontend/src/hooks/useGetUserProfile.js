import { useEffect, useState } from "react";
import {useParams} from 'react-router-dom'
import useShowToast from "./useShowToast.js";


const useGetUserProfile = ()=>{
    const [user, setUser] = useState(null)
    const[loading, setLoading] = useState(true)
    const showToast = useShowToast()
    const {username} = useParams()

    useEffect(()=>{

        const getUser = async () => {
            try {
              const response = await fetch(`/api/users/profile/${username}`);
              const data = await response.json();
              if (data.error) {
                showToast("Error", data.error, "error");
                return;
              }
              if(data.isFrozen){
                setUser(null)
                return
              }
              setUser(data);
            } catch (error) {
              showToast("Error", error.message, "error");
            } finally {
              setLoading(false);
            }
          };

          getUser()

    },[username, showToast])

    return {loading, user}
}


  export default useGetUserProfile