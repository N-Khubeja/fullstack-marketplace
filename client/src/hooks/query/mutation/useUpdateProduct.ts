import { getQueryClient } from "@/lib/react-query/get-query-client"
import { createProduct, IupdateProduct, updateProduct } from "@/services/productService"
import { useMutation, useQueryClient } from "@tanstack/react-query"



const useUpdateProduct = () => {
  const queryClient = useQueryClient()


    const result = useMutation({
        mutationFn:({data,image,keepImageId,slug}:IupdateProduct) => updateProduct({data,image,keepImageId,slug}),
        onError:(err) => console.log(err),
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey:["Products"]})
        }
    })

    return result
}

export default useUpdateProduct