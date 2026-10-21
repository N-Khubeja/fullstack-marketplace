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

  const user = useStoreAuth((s) => s.user)

  const result = useQuery({
    queryKey:['favorite-products'],
    queryFn:getFavoriteProducts,
    enabled:!!user


  })
  
  return result
}

export default useGetFavoriteProds