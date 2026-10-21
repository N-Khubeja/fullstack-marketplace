import ProductListQuery from "@/components/ProductListQuery"
import { getQueryClient } from "@/lib/react-query/get-query-client"
import { getProducts } from "@/services/productService"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

interface searchparamsProps {
  searchParams: Promise<{
     page?: string
    search?: string
    category?: string
    sortBy?: string
    order?: string
    subcategory?:string
    minPrice?:string
    maxPrice?:string
  }>
}

export default async function page({searchParams}:searchparamsProps) {

  const params = await searchParams

  const search = params.search
  const category = params.category
  const sortBy = params.sortBy
  const order = params.order
  const subcategory = params.subcategory
const minPrice = params.minPrice
  ? Number(params.minPrice)
  : undefined

  const maxPrice = params.maxPrice
  ? Number(params.maxPrice)
  : undefined

  
  const filters = {
    search,
    category,
    sortBy,
    order,
    subcategory,
    minPrice,
    maxPrice
  }


  const queryClient = getQueryClient()

await queryClient.prefetchInfiniteQuery({
    queryKey: ["products",filters],
    queryFn: ({ pageParam }) =>
      getProducts({
      ...filters,
      page: pageParam,
    }),
    initialPageParam: 1,
getNextPageParam: (lastPage:any) => {
  if (
    lastPage.pagination.page <
    lastPage.pagination.totalPages
  ) {
    return lastPage.pagination.page + 1
  }

  return undefined
},
  })

  const dehydratedState = dehydrate(queryClient)


  return (
    <HydrationBoundary state={dehydratedState}>
      <ProductListQuery />
    </HydrationBoundary>
  )
}
