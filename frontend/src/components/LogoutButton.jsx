// import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
// import { useSetRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import useShowToast from "../hooks/useShowToast.js";
// import { MdLogout } from "react-icons/md";
// import { useState } from "react";

// const LogoutButton = () => {
//   const OverlayOne = () => (
//     <ModalOverlay
//       bg='blackAlpha.300'
//       backdropFilter='blur(10px) hue-rotate(90deg)'
//     />
//   )
//   const { isOpen, onOpen, onClose } = useDisclosure()
//   const [overlay, setOverlay] = useState(<OverlayOne />)
//   const showToast = useShowToast();

//   const setUserState = useSetRecoilState(userAtom);

//   const handleLogout = async () => {
//     try {
//       const response = await fetch("/api/users/logout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();

//       if (data.error) {
//         showToast("Error", data.error, "error");
//         return
//       }

//       localStorage.removeItem("userInfo");

//       setUserState(null);
//     } catch (error) {
//       showToast("Error", error, "error")
//     }
//   };
//   return (
//     <>
//     <Button
//       position={"fixed"}
//       top={"30px"}
//       right={"30px"}
//       size={"sm"}
//       onClick={() => {
//         setOverlay(<OverlayOne />)
//         onOpen()
//       }}
//     >
//       <MdLogout size={"20px"} />
//     </Button>

    
      
//       <Modal isCentered isOpen={isOpen} onClose={onClose}>
//         {overlay}
//         <ModalContent>
//           <ModalHeader>Logout</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <Text>Are you really want to Logout?</Text>
//           </ModalBody>
//           <ModalFooter>
//             <Button mr={"10px"} onClick={onClose}>Cancel</Button>
            
//             <Button onClick={handleLogout}>Logout</Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>



    
//   );
// };

// export default LogoutButton;
