import React, { useState } from "react";
import { Flex, Text, Avatar, Box, Image, Skeleton } from "@chakra-ui/react";

import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/conversationsAtom.js";
import { BiCheckDouble } from "react-icons/bi";

const Message = ({ ownMessage, message }) => {
  const currentUser = useRecoilValue(userAtom);
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [imageLoaded, setImageLoaded] = useState(false);

  const ownMessageStyles = {
    backgroundColor: "#4299e1",
    color: "#ffffff",
    padding: "10px 15px",
    borderRadius: "20px 20px 0px 20px",
  };

  const receivedMessageStyles = {
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: "20px 20px 20px 0px",
    padding: "10px 15px",
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} p={1} alignSelf={"flex-end"}>
          {message.text && (
            <Flex flexDirection={"column"}>
            <Text
              maxW={{ lg: "320px", md: "320px", base: "200px" }}
              style={ownMessageStyles}
            >
              {message.text}
            </Text>
            <Flex justifyContent={"right"} alignItems={"center"} >
              <Text fontSize="sm" color="gray.500">
                {formatTime(message.createdAt)}
              </Text>
              <Box color={message.seen? "blue.600" : ""}>
                <BiCheckDouble size={16} />
              </Box>
            </Flex>
          </Flex>
          )}
          {message.img && !imageLoaded && (
             
             <Flex mt={5} w={"200px"}>
              <Image src={message.img} hidden onLoad={()=>setImageLoaded(true)} borderRadius={4}/>
              <Skeleton h={"200px"} w={"200px"} />
             </Flex>
            
           
          )}

          {message.img && imageLoaded && (
             <Flex flexDirection={"column"}>
             <Flex mt={5} w={"200px"}>
              <Image src={message?.img}  borderRadius={4}/>
              
             </Flex>
             <Flex justifyContent={"right"} alignItems={"center"} >
               <Text fontSize="sm" color="gray.500">
                 {formatTime(message.createdAt)}
               </Text>
               <Box color={message.seen? "blue.600" : ""}>
                 <BiCheckDouble size={16} />
               </Box>
             </Flex>
           </Flex>
          )}      
          

          <div style={{ display: "flex", alignItems: "end" }}>
            <Avatar src={currentUser?.profilePic} w={7} h={7} />
          </div>
        </Flex>
      ) : (
        <Flex gap={2} p={1}>
          <div style={{ display: "flex", alignItems: "end" }}>
            <Avatar src={selectedConversation?.userProfilePic} w={7} h={7} />
          </div>
          {message.text && (
            <Flex flexDirection={"column"}>
            <Text
              maxW={{ lg: "320px", md: "320px", base: "200px" }}
              style={receivedMessageStyles}
            >
              {message.text}
            </Text>
            <Text textAlign={"left"} fontSize="sm" color="gray.500">
              {formatTime(message.createdAt)}
            </Text>
          </Flex>
          )}
          {message.img && !imageLoaded && (
             
             <Flex mt={5} w={"200px"}>
              <Image src={message.img} hidden onLoad={()=>setImageLoaded(true)} borderRadius={4}/>
              <Skeleton h={"200px"} w={"200px"} />
             </Flex>
            
           
          )}

          {message.img && imageLoaded && (
             <Flex flexDirection={"column"}>
             <Flex mt={5} w={"200px"}>
              <Image src={message?.img}  borderRadius={4}/>
              
             </Flex>
             <Flex justifyContent={"left"} alignItems={"center"} >
               <Text fontSize="sm" color="gray.500">
                 {formatTime(message.createdAt)}
               </Text>
               
             </Flex>
           </Flex>
          )}  
        </Flex>
      )}
    </>
  );
};

export default Message;
