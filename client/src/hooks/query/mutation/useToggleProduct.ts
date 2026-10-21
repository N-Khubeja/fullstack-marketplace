// import { ToggleFavorite } from "@/services/productService"
// import { useMutation, useQueryClient } from "@tanstack/react-query"

// const useToggleProduct = () => {
//   const queryClient = useQueryClient()
//   const result = useMutation({
//     mutationFn:(id:string) => ToggleFavorite(id),
//     onError:(err) => console.log(err),
//     onSuccess:() => {
//        queryClient.invalidateQueries({queryKey:['favorite-products']}) 
//     }
//   })

//   return result
// }

// export default useToggleProduct











// import { IsingleFavProd } from "@/components/ProductList"
// import { ToggleFavorite } from "@/services/productService"
// import { useMutation, useQueryClient } from "@tanstack/react-query"


// interface INewData {
//     message:string
//     result?:IsingleFavProd
// }


// const useToggleProduct = () => {
//   const queryClient = useQueryClient()
//   const result = useMutation({
//     mutationFn:(id:string) => ToggleFavorite(id),
//     onError:(err) => console.log(err),
//     onSuccess:(newData:INewData,id:string) => {
//       queryClient.setQueryData(['favorite-products'],(oldData: IsingleFavProd[] = []) => {
//         const result = newData.result
//         if(result){
//             return [...oldData,result]
//         } else {
//              return oldData.filter(
//             (old) => old.product._id !== id
//             )
//         }
//       })
//     }
//   })

//   return result
// }

// export default useToggleProduct














import { IsingleFavProd } from "@/components/ProductList";
import { IProduct, ToggleFavorite } from "@/services/productService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useToggleProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }:{id:string,product:IProduct}) => ToggleFavorite(id),

    onMutate: async ({ id, product }:{id:string,product:IProduct}) => {
  await queryClient.cancelQueries({
    queryKey: ["favorite-products"]
  })

  const previousData =
    queryClient.getQueryData<IsingleFavProd[]>(
      ["favorite-products"]
    )

  queryClient.setQueryData<IsingleFavProd[]>(
    ["favorite-products"],
    (oldData = []) => {
      const exists = oldData.some(
        item => item.product._id === id
      )

      if (exists) {
        return oldData.filter(
          item => item.product._id !== id
        )
      }

      return [
        ...oldData,
        {
          _id: `temp-${id}`,
          user: "temp",
          product
        }
      ]
    }
  )

  return { previousData }
},

    onError: (_error, _id, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(
          ["favorite-products"],
          context.previousData
        );
      }
    },

onSuccess: (data, variables) => {
  if (data.result) {
    queryClient.setQueryData<IsingleFavProd[]>(
      ["favorite-products"],
      (oldData = []) =>
        oldData.map(item =>
          item.product._id === variables.id
            ? data.result
            : item
        )
    )
  }
},

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-products"],
      });
    },
  });
};

export default useToggleProduct;
