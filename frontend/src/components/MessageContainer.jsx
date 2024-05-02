import React, { useEffect, useState, useRef } from "react";
import {
  Flex,
  Avatar,
  Text,
  Image,
  Divider,
  Box,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { SkeletonCircle, Skeleton } from "@chakra-ui/react";
import Message from "./Message";
import { IoIosCall } from "react-icons/io";
import { FcVideoCall } from "react-icons/fc";
import { MdKeyboardBackspace } from "react-icons/md";
import MessageInput from "./MessageInput";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/conversationsAtom.js";
import useShowToast from "../hooks/useShowToast.js";
import userAtom from "../atoms/userAtom.js";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";
import messageSound from "../assets/sounds/messageSound.mp3";

const MessageContainer = () => {
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const setConversations = useSetRecoilState(conversationsAtom);

  const [fetchingMessages, setFetchingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const showToast = useShowToast();
  const otherUserId = selectedConversation?.otherUserId;
  const { socket } = useSocket();

  const messageContainerRef = useRef(null); // Ref to message container element

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation?._id === message.conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }

      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play();
      }

      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                sender: message.sender,
                text: message.text,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectedConversation, setConversations]);

 
  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages?.[messages.length - 1]?.sender !== currentUser?._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessageAsRead", {
        conversationId: selectedConversation?._id,
        userId: otherUserId,
      });
    }
    socket.on("messageRead", ({ conversationId }) => {
      if (selectedConversation?._id === conversationId  ) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [selectedConversation, messages, currentUser._id, socket]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setFetchingMessages(true);
    setMessages([]);
    const fetchMessages = async () => {
      try {
        if (selectedConversation?.mock) return;
        const res = await fetch(`/api/messages/${otherUserId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setMessages(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setMessages([]);
      } finally {
        setFetchingMessages(false);
      }
    };
    fetchMessages();
  }, [showToast, otherUserId, selectedConversation.mock]);

  const handleSeletedConverstaion = ()=>{
    setSelectedConversation({})
  }


  return (
    <Flex
     
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
      gap={2}
      // mb={{base:-4, md:0}}
      mx={{base:-4, md : 0}}
      // mt={{base:-10, md:0}}
      
      
      
    >
      
      <Flex
        alignItems={"center"}
        w={"full"}
        gap={2}
        h={12}
        justifyContent={"space-between"}
      >
        <Flex gap={2}>
        <Box  display={{
          base: "flex",
          md: "none"
        }} alignItems={"center"} onClick={handleSeletedConverstaion}>
        <MdKeyboardBackspace cursor={"pointer"} size={30} />
        </Box>
          <Avatar
            src={selectedConversation?.userProfilePic}
            onClick={() => navigate(`/${selectedConversation?.username}`)}
            cursor={"pointer"}
          />
          <Text
            display={"flex"}
            alignItems={"center"}
            onClick={() => navigate(`/${selectedConversation?.username}`)}
            cursor={"pointer"}
          >
            {selectedConversation?.username}{" "}
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Text>
        </Flex>
        <Flex mr={"10px"} gap={4} alignItems={"center"}>
          <FcVideoCall color="" cursor={"not-allowed"} size={30} />
          <IoIosCall cursor={"not-allowed"} size={25} />
        </Flex>
      </Flex>
      <Divider />
      <Box>
        <Flex
          ref={messageContainerRef} // Set ref to the message container element
          gap={4}
          my={4}
          height={"400px"}
          overflowY={"auto"}
          flexDirection={"column"}
          scrollBehavior={"smooth"}
          p={2}
        >
          {fetchingMessages &&
            [...Array(6)].map((_, i) => (
              <Flex
                key={i}
                alignItems={"center"}
                gap={2}
                p={1}
                borderRadius={"md"}
                alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
              >
                {i % 2 === 0 && <SkeletonCircle size={7} />}
                <Flex flexDir={"column"} gap={2}>
                  <Skeleton h={"8px"} w={"250px"} />
                  <Skeleton h={"8px"} w={"250px"} />
                  <Skeleton h={"8px"} w={"250px"} />
                </Flex>
                {i % 2 !== 0 && <SkeletonCircle size={7} />}
              </Flex>
            ))}
          {!fetchingMessages && messages?.length === 0 && (
            <Text fontSize={"sm"} textAlign={"center"}>
              No messages found
            </Text>
          )}
          {!fetchingMessages &&
            messages?.length > 0 &&
            messages.map(
              (message) =>
                selectedConversation?._id === message.conversationId && (
                  <Message
                    key={message._id}
                    message={message}
                    ownMessage={
                      message.sender.toString() === currentUser._id.toString()
                    }
                  />
                )
            )}
        </Flex>
      </Box>
      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
