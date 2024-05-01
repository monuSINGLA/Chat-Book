import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  useColorModeValue,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  Textarea,
  Image,
  Input,
  FormControl,
  Flex,
  CloseButton,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast.js";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import usePreviewImage from "../hooks/usePreviewImage.js";
import {BsFillImageFill} from 'react-icons/bs'
import postsAtom from "../atoms/postsAtom.js";
import {useParams} from 'react-router-dom'

const MAX_CHAR = 500;

const CreatePost = () => {
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [postText, setPostText] = useState();
  const imageRef = useRef(null)
  const [remaingChar, setRemaingChar] = useState(MAX_CHAR)
  const[posts, setPosts] = useRecoilState(postsAtom)
  const {username} = useParams()

 
 const handlePostText = (e)=>{
  const inputText = e.target.value
  
  if(inputText.length > MAX_CHAR){
    const truncatedText = inputText.slice(0,MAX_CHAR);
    setPostText(truncatedText)
    setRemaingChar(0)
    
  }else{
    setPostText(inputText)
    setRemaingChar(MAX_CHAR - inputText.length)
    
  }
 }

  const handleCreatePost = async () => {
    
    if (!postText) {
      showToast("Error", "Cannot create empty post", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postText,
          postedBy: currentUser._id,
          postImage: imgUrl,
        }),
      });

      const data = await response.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Post created successfully", "success");

      if(username === currentUser.username){
        setPosts([data, ...posts ])
      }

      setPostText("");
      setImgUrl("")
      setRemaingChar(MAX_CHAR)
      onClose()

      console.log(data);
    } catch (error) {
      showToast("Error", error, "error");

    } finally {
      setLoading(false);
    }
  };

  

  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={() => {
          onOpen();
        }}
        size={{base:"sm", sm:"md"}}
      >
        <AddIcon />
      </Button>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post content goes here..."
                value={postText}
                onChange={handlePostText}
               
              />

              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                m={1}
                color={"gray.800"}
              >
                {remaingChar}/{MAX_CHAR}
              </Text>

              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
              size={16}
              onClick={()=>imageRef.current.click()}
              style={{marginLeft:"5px", cursor: "pointer"}}
              
              />
            </FormControl>

            {imgUrl && (
              <Flex w={"full"} mt={"5"} position={"relative"}>
                  <Image src={imgUrl} alt="Selected img"/>
                  <CloseButton onClick={()=>setImgUrl("")} bg={"gray.800"} position={"absolute"} top={2} right={2}/>
                  
              </Flex>

            )}
          </ModalBody>
          <ModalFooter>
            <Button mr={"10px"} onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleCreatePost} isLoading={loading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
