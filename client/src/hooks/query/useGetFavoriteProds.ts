// import { getFavoriteProducts } from "@/services/productService"
// import {  useQuery } from "@tanstack/react-query"

// const useGetFavoriteProds = () => {


//   const result = useQuery({
//     queryKey:['favorite-products'],
//     queryFn:getFavoriteProducts
//   })
  
//   return result
// }

// export default useGetFavoriteProds


import { getFavoriteProducts } from "@/services/productService"
import { useStoreAuth } from "@/store/useStoreAuth"
import {  useQuery } from "@tanstack/react-query"

const useGetFavoriteProds = () => {

  const userId = useStoreAuth(
  state => state.user?.id
)


  const result = useQuery({
    queryKey:['favorite-products', userId],
    queryFn:getFavoriteProducts,
    enabled:!!userId


  })
  
  return result
}

export default useGetFavoriteProds