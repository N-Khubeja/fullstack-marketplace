import { getQueryClient } from "@/lib/react-query/get-query-client"
import { ProductSchema } from "@/lib/schemas/productSchemas"
import { createProduct } from "@/services/productService"
import { useMutation, useQueryClient } from "@tanstack/react-query"


const useCreateProduct = () => {
  const queryClient = useQueryClient()

    const result = useMutation({
        mutationFn:({data,image}:{data:ProductSchema,image:File[]}) => createProduct({data,image}),
        onError:(err) => console.log(err),
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey:["Products"]})
        }
    })

    return result
}

export default useCreateProduct