import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom.js";
import useShowToast from "./useShowToast.js";


const useLogout = () => {
    const showToast = useShowToast();

    const setUser = useSetRecoilState(userAtom);
    const logout = async () => {
        if(!window.confirm("Are you want to Logout?")) return
        try {
          const response = await fetch("/api/users/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
    
          if (data.error) {
            showToast("Error", data.error, "error");
            return
          }
    
          localStorage.removeItem("userInfo");
    
          setUser(null);
        } catch (error) {
          showToast("Error", error, "error")
        }
      };
      return logout
}

export default useLogout