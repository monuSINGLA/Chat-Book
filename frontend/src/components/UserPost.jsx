// import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
// import React, { useState } from "react";
// import { BsThreeDots } from "react-icons/bs";
// import { Link } from "react-router-dom";
// import Actions from "./Actions";
// const UserPost = ({likes, replies, postImg, postTitle}) => {
//   const [liked, setLiked] = useState(false);
  
//   return (
//     <Link to={"/jiteshsingla/post/1"}>
//       <Flex gap={3} py={5}>
//         <Flex flexDirection={"column"} alignItems={"center"}>
//           <Avatar
//             size={"md"}
//             name="Jitesh Singla"
//             src="https://media.licdn.com/dms/image/C5122AQHMip3xEragNQ/feedshare-shrink_2048_1536/0/1576771752142?e=2147483647&v=beta&t=R9N3uVpFyk2XDdpku2ECZHr4aXx79a1XXB_VZf1_CuA"
//           />
//           <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
//           <Box position={"relative"} w={"full"}>
//             <Avatar
//               size={"xs"}
//               name="Dan Abrahmov"
//               src="https://bit.ly/dan-abramov"
//               position={"absolute"}
//               top={"0px"}
//               left={"15px"}
//               padding={"2px"}
//             />
//             <Avatar
//               size={"xs"}
//               name="Dan Abrahmov"
//               src="https://bit.ly/sage-adebayo"
//               position={"absolute"}
//               bottom={"0px"}
//               right={"-5px"}
//               padding={"2px"}
//             />
//             <Avatar
//               size={"xs"}
//               name="monu"
//               src="https://bit.ly/code-beast"
//               position={"absolute"}
//               bottom={"0px"}
//               left={"4px"}
//               padding={"2px"}
//             />
//           </Box>
//         </Flex>

//         <Flex flex={1} flexDirection={"column"} gap={2}>
//           <Flex justifyContent={"space-between"} w={"full"}>
//             <Flex alignItems={"center"} w={"full"}>
//               <Text fontSize={"sm"} fontWeight={"bold"}>
//                 jiteshsingla
//               </Text>
//               <Image src="/verified.png" w={4} h={4} ml={1} />
//             </Flex>

//             <Flex alignItems={"center"} gap={4}>
//               <Text fontSize={"sm"} color={"gray.light"}>
//                 1d
//               </Text>
//               <BsThreeDots />
//             </Flex>
//           </Flex>

//           <Text fontSize={"sm"}>{postTitle}</Text>
//           {postImg && (
//             <Box
//             borderRadius={6}
//             overflow={"hidden"}
//             border={"1px solid"}
//             borderColor={"gray.light"}
//           >
//             <Image src={postImg} w={"full"} />
//           </Box>
//           )}

//           <Flex gap={3} my={1}>
//             <Actions liked={liked} setLiked={setLiked} />
//           </Flex>

//           <Flex gap={2} alignItems={"center"}>
//             <Text color={"gray.light"} fontSize={"sm"}>{replies} replies</Text>
//             <Box w={1} h={1}  borderRadius={"full" } bg={"gray.light"}></Box>
//             <Text color={"gray.light"} fontSize={"sm"}>{likes} likes</Text>
//           </Flex>
//         </Flex>
//       </Flex>
     
//     </Link>
//   );
// };

// export default UserPost;
