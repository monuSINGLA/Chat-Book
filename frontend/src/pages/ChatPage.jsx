import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Input, Button } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { SkeletonCircle, Skeleton } from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import useShowtoast from "../hooks/useShowToast.js";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/conversationsAtom.js";
import userAtom from "../atoms/userAtom.js";
import { useSocket } from "../context/SocketContext.jsx";

const ChatPage = () => {
  const showToast = useShowtoast();
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [fetchingConversations, setFetchingConversations] = useState(true);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  
  
  const [searchUserForConversation, setSearchUserForConversation] =
    useState("");
  const [isSeacingUserForConversation, setIsSeacingUserForConversation] =
    useState(false);
  const currentUser = useRecoilValue(userAtom);
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    socket?.on("messageRead", ({conversationId})=>{
     
       setConversations((prev)=>{
        const updatedConversations = prev.map((conversation)=>{
          if(conversation._id === conversationId){
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true
              }
            }
          }
          return conversation 
       })
       return updatedConversations
      })
    })
  },[ setConversations, socket])

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setFetchingConversations(false);
      }
    };

    fetchConversations();
  }, [showToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    if (!searchUserForConversation) return;
    setIsSeacingUserForConversation(true);

    try {
      const res = await fetch(
        `/api/users/profile/${searchUserForConversation}`
      );
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      const messagingYourSelf = data._id === currentUser._id;
      if (messagingYourSelf) {
        showToast("Error", "You can't chat with yourself", "error");
        return;
      }

      const isAlreadyInConversation = conversations?.find(
        (conversation) => conversation?.participants[0]?._id === data?._id
      );
      if (isAlreadyInConversation) {
        setSelectedConversation({
          _id: isAlreadyInConversation._id,
          otherUserId: data?._id,
          username: data?.username,
          userProfilePic: data?.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: data?._id,
            username: data?.username,
            profilePic: data?.profilePic,
          },
        ],
      };

      setConversations((prevConversations) => [
        ...prevConversations,
        mockConversation,
      ]);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsSeacingUserForConversation(false);
    }
  };

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      transform={"translateX(-50%)"}
      w={{
        base: "100%",
        md: "80%",
        lg: "750px",
      }}
      p={4}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "480px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          flexDirection={"column"}
          gap={2}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2} display={{base:selectedConversation._id?"none": "flex"}} >
              <Input
                type="text"
                placeholder="Search for a user"
                onChange={(e) => setSearchUserForConversation(e.target.value)}
                value={searchUserForConversation}
              />
              <Button
                size={"sm"}
                onClick={handleConversationSearch}
                isLoading={isSeacingUserForConversation}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {fetchingConversations &&
            [1, 2, 3, 4, 5].map((_, index) => (
              <Flex
                key={index}
                alignItems={"center"}
                gap={4}
                borderRadius={"sm"}
                p={1}
              >
                <Box>
                  <SkeletonCircle />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {!fetchingConversations && conversations?.length === 0 && (
            <Text  textAlign={"center"}>
              Search a user for converstaion
            </Text>
          )}

          <Flex
            flexDirection={"column"}
            overflow={"auto"}
            scrollBehavior={"smooth"}
            
          >
            {!fetchingConversations && conversations?.length > 0 &&
              conversations?.map((conversation) => (
                <Conversation
                  isOnline={onlineUsers?.includes(conversation?.participants[0]?._id)}
                  key={conversation?._id}
                  conversation={conversation}
                />
              ))}
          </Flex>
        </Flex>

        {!selectedConversation?._id && (
          <Flex
          display={{
            base: "none",
            md: "flex"
          }}
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a user to chat with</Text>
          </Flex>
        )}

        {selectedConversation?._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
