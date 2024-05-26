import React, { useRef, useState } from "react";
import { Image, Flex, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner } from "@chakra-ui/react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast.js";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/conversationsAtom.js";
import { FaRegImage } from "react-icons/fa6";
import usePreviewImage from "../hooks/usePreviewImage.js";
import { useDisclosure } from "@chakra-ui/react";

const MessageInput = ({ setMessages }) => {
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const setConversations = useSetRecoilState(conversationsAtom);

  const showToast = useShowToast();
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = React.useState(false);
  const imageRef = useRef(null);
  const {  onClose} = useDisclosure()
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage()
  

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !imgUrl) return;
    if(loading) return

    setLoading(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation?.otherUserId,
          img: imgUrl,
        }),
      });

      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      // console.log(data)

      setMessages((prevMessages) => [...prevMessages, data]);

      setConversations((prevConnversations) => {
        const updatedConversations = prevConnversations?.map((conversation) => {
          if (conversation?._id === selectedConversation?._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data?.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });

      setMessageText("");
      setImgUrl("")
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Flex alignItems={"center"} gap={2}>
        <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
          <InputGroup>
            <Input
              w={"full"}
              placeholder="Type your message here"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
              <IoSendSharp />
            </InputRightElement>
          </InputGroup>
        </form>

        <Flex flex={5} cursor={"pointer"}>
          <FaRegImage size={20} onClick={()=>imageRef.current.click()} />
         
          <Input type="file" ref={imageRef} hidden onChange={handleImageChange} />
        </Flex>
      </Flex>



      <Modal isOpen={imgUrl} onClose={()=>{
        onClose()
        setImgUrl(null)
      }}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"}>
              <Image src={imgUrl} />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {loading ? <Spinner size={"md"} /> : <IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />}
            </Flex>
          </ModalBody>

          
        </ModalContent>
      </Modal>

    </>
  );
};

export default MessageInput;
