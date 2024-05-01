import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import  { useEffect, useState } from 'react'
import SuggestedUserCard from './SuggestedUserCard'
import useShowToast from '../hooks/useShowToast.js'

const SuggestedUsers = () => {
    const [loading, setLoading] = useState(false)
    const [suggestedUsers, setSuggestedUsers] = useState([])
    const showToast = useShowToast() 


    useEffect(() => {
      const getSuggestedUsers = async () => {
          setLoading(true);
          setSuggestedUsers([]);
          try {
              const res = await fetch("/api/users/suggested");
              const data = await res.json();
              
  
              if (data.error) {
                  showToast(data.error, "error");
                  return;
              }
              setSuggestedUsers(data);
          } catch (error) {
              showToast(error.message, "error");
          } finally {
              setLoading(false);
          }
      };
  
      getSuggestedUsers();
  }, [showToast]);
  


  return (
    <>
    
    <Text mb={4} textAlign={"center"} fontWeight={"bold"}>Suggested Users</Text>

    <Flex direction={"column"} gap={4}>
      
      {!loading && (
        suggestedUsers.map((user) => (
            <SuggestedUserCard key={user?._id} user={user} />
        ))
      )}
     {loading && (
        [...Array(5)].map((_, i) => (
            <Flex key={i} alignItems={"center"} gap={2} p={1} borderRadius={"md"}>

          <Box>
            <SkeletonCircle size={10} />
          </Box>

          <Flex w={"full"} gap={2} direction={"column"}>
            <Skeleton h={"8px"} w={"80px"}/>
            <Skeleton h={"8px"} w={"90px"}/>
           
          </Flex>
          <Flex>
            <Skeleton h={"20px"} w={"60px"}/>

            </Flex>
            </Flex>

          
        ))
     ) }

    </Flex>
    </>
  )
}

export default SuggestedUsers