// "use client"

// import { getProducts, IProductProps } from "@/services/productService"
// import { useInfiniteQuery } from "@tanstack/react-query"
// import { useSearchParams } from "next/navigation"
// import ProductList from "./ProductList"
// import { useEffect, useRef } from "react"

// export default function ProductListQuery() {

//      const targetRef = useRef<HTMLDivElement>(null);



//     const searchParams = useSearchParams()
//     const minPriceParam = searchParams.get("minPrice")
//     const maxPriceParam = searchParams.get("maxPrice")

//     const filters: IProductProps = {
//         search: searchParams.get("search") || undefined,
//         category: searchParams.get("category") || undefined,
//         subcategory: searchParams.get("subcategory") || undefined,
//         sortBy: searchParams.get("sortBy") || undefined,
//         order: searchParams.get("order") || undefined,
//         minPrice:
//             minPriceParam !== null
//             ? Number(minPriceParam)
//             : undefined,
//         maxPrice:
//             maxPriceParam !== null
//             ? Number(maxPriceParam)
//             : undefined,
//     }

//    const {
//     data,
//     error,
//     isPending,
//     isError,
//     fetchNextPage,
//     hasNextPage,
//     isFetching,
//     isFetchingNextPage,
//     status,
//   } = useInfiniteQuery({
//     queryKey: ['products',filters],
//     queryFn: ({ pageParam }) =>
//     getProducts({
//         ...filters,
//         page: pageParam,
//     }),
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) => {
//   if (
//     lastPage.pagination.page <
//     lastPage.pagination.totalPages
//   ) {
//     return lastPage.pagination.page + 1
//   }

//   return undefined
// }
//   })


//    useEffect(() => {
//     const element = targetRef.current;

//     if (!element) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (
//           entries[0]?.isIntersecting &&
//           hasNextPage &&
//           !isFetchingNextPage
//         ) {
//           fetchNextPage();
//         }
//       },
//       {
//         rootMargin: "200px",
//       }
//     );

//     observer.observe(element);

//     return () => observer.disconnect();
//   }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

//   const result = data?.pages.flatMap((res) => res.products) ?? []

//     if (isPending) {
//     return <p>Loading products...</p>
//   }

//   if (isError) {
//     return (
//       <p>
//         Failed to load products: {error.message}
//       </p>
//     )
//   }


//   return (
//     <div>
//         <ProductList data={result} />
//          <div ref={targetRef}>
       
//       </div>
//     </div>
//   )
// }



"use client"

import { getProducts, IProductProps } from "@/services/productService"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import ProductList from "./ProductList"
import { useEffect, useRef } from "react"

export default function ProductListQuery() {




    const searchParams = useSearchParams()
    const minPriceParam = searchParams.get("minPrice")
    const maxPriceParam = searchParams.get("maxPrice")

    const filters: IProductProps = {
        search: searchParams.get("search") || undefined,
        category: searchParams.get("category") || undefined,
        subcategory: searchParams.get("subcategory") || undefined,
        sortBy: searchParams.get("sortBy") || undefined,
        order: searchParams.get("order") || undefined,
        minPrice:
            minPriceParam !== null
            ? Number(minPriceParam)
            : undefined,
        maxPrice:
            maxPriceParam !== null
            ? Number(maxPriceParam)
            : undefined,
    }

   const {
    data,
    error,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['products',filters],
    queryFn: ({ pageParam }) =>
    getProducts({
        ...filters,
        page: pageParam,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
  if (
    lastPage.pagination.page <
    lastPage.pagination.totalPages
  ) {
    return lastPage.pagination.page + 1
  }

  return undefined
}
  })




  const result = data?.pages.flatMap((res) => res.products) ?? []

    if (isPending) {
    return <p>Loading products...</p>
  }

  if (isError) {
    return (
      <p>
        Failed to load products: {error.message}
      </p>
    )
  }


  return (
    <div>
        <ProductList
        data={result}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        />       
    </div>
  )
}
