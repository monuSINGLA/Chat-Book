import { Button, Text } from "@chakra-ui/react"
import useShowToast from "../hooks/useShowToast"
import useLogout from "../hooks/useLogout"


const SettingsPage = () => {
    const showtoast = useShowToast()
    const logout = useLogout()

    const freezeAccount = async ()=>{
        if(!window.confirm("Are you sure, you want to freeze your account")) return

        try {
            const res = await fetch("/api/users/freeze", {
                method:"PUT",
                headers:{
                    "Content-Type" : "application/json"
                }
            })
            const data = await res.json()

            if(data.error){
                showtoast("Error", data.error, "error")
                return
            }
            if(data.success){
               await logout()
                showtoast("Success", "Your account has been frozen", "success")
            }

        } catch (error) {
            showtoast("Error", error.message, "error")
        }
    }
  return (

    <>
    <Text my={1} fontWeight={"bold"}>
        Freeze Your Account
    </Text>
    <Text my={1}>
        If you freezed your account then your profile will be unable to see.
        And you can unfreeze your account anytime by logging in.
    </Text>
    <Button onClick={freezeAccount} size={"sm"} colorScheme="red" >Freeze</Button>
    </>
  )
}

export default SettingsPage