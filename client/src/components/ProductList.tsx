


// import { IProduct } from "@/services/productService";
// import "./ProductList.css";
// import useGetFavoriteProds from "@/hooks/query/useGetFavoriteProds";
// import { Heart } from "lucide-react";

// interface ProductListProps {
//   data: IProduct[];
// }

// export interface IsingleFavProd{
//   _id: string,
//   user: string,
//   product: IProduct
// }

// export default function ProductList({ data }: ProductListProps) {
//     const {data:favoriteProds} = useGetFavoriteProds()
    
// const savedProdusIds = favoriteProds?.map(
//   (fav: IsingleFavProd) => fav.product._id
// ) ?? []

// const savedIds = new Set<string>(savedProdusIds)

// const check = (id: string) => {
//   return savedIds.has(id)
// }




//   return (
//     <div className="product-list-container">
//       <div className="product-list-header">
//         <div>
//           <h1 className="product-list-title">Products</h1>
//           <p className="product-list-subtitle">
//             Manage and explore your products
//           </p>
//         </div>

//         <span className="product-count">
//           {data.length} products
//         </span>
//       </div>

//       <div className="product-grid">
//         {data.map((product, index) => (
//           <article className="product-card" key={product.slug}>
//             <div className="product-card-top">
//               <span className="product-number">
//                 #{String(index + 1).padStart(2, "0")}
//               </span>

//               <span
//                 className={`product-stock ${
//                   product.stock > 0 ? "in-stock" : "out-of-stock"
//                 }`}
//               >
//                 {product.stock > 0 ? "In stock" : "Out of stock"}
//               </span>
//               <Heart
//                style={{cursor:"pointer"}}
//                 color={check(product._id) ? "red" : "grey"}
//                 fill={check(product._id) ? "red" : "none"}
//               />
//             </div>

//             <div className="product-card-content">
//               <h2 className="product-name">{product.name}</h2>

//               <p className="product-description">
//                 {product.description || "No description available."}
//               </p>
//             </div>

//             <div className="product-card-footer">
//               <div className="product-price-wrapper">
//                 <span className="product-price-label">Price</span>
//                 <p className="product-price">
//                   ${Number(product.price).toFixed(2)}
//                 </p>
//               </div>

//               <div className="product-stock-wrapper">
//                 <span className="product-price-label">Available</span>
//                 <p className="product-stock-count">
//                   {product.stock} units
//                 </p>
//               </div>
//             </div>
//           </article>
//         ))}
//       </div>

//       {data.length === 0 && (
//         <div className="product-empty">
//           <div className="product-empty-icon">📦</div>
//           <h2>No products found</h2>
//           <p>There are no products to display yet.</p>
//         </div>
//       )}
//     </div>
//   );
// }






import { IProduct } from "@/services/productService";
import "./ProductList.css";
import useGetFavoriteProds from "@/hooks/query/useGetFavoriteProds";
import { useEffect, useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Heart } from "lucide-react";
import useToggleProduct from "@/hooks/query/mutation/useToggleProduct";
import { useStoreAuth } from "@/store/useStoreAuth";

interface ProductListProps {
  data: IProduct[]
  fetchNextPage: () => Promise<unknown>
  hasNextPage: boolean
  isFetchingNextPage: boolean
}

export interface IsingleFavProd{
  _id: string,
  user: string,
  product: IProduct
}

export default function ProductList({ data ,fetchNextPage,hasNextPage,isFetchingNextPage}: ProductListProps) {

  const parentRef = useRef<HTMLDivElement>(null)
  const user = useStoreAuth((s) => s.user)

  const {mutate} = useToggleProduct()

const rowVirtualizer = useVirtualizer({
  count: data.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 220,
  overscan: 5,
})

const handleClick = (product: IProduct) => {
  if(!user) return
  mutate({
    id: product._id,
    product,
  });
};

    const {data:favoriteProds} = useGetFavoriteProds()
    
const savedProdusIds = favoriteProds?.map(
  (fav: IsingleFavProd) => fav.product._id
) ?? []

const savedIds = new Set<string>(savedProdusIds)

const check = (id: string) => {
  return savedIds.has(id)
}

const virtualItems = rowVirtualizer.getVirtualItems()

const lastItem =
  virtualItems[virtualItems.length - 1]


useEffect(() => {
  if (!lastItem) return

  if (
    lastItem.index >= data.length - 3 &&
    hasNextPage &&
    !isFetchingNextPage
  ) {
    fetchNextPage()
  }
}, [
  lastItem,
  data.length,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
])



  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <div>
          <h1 className="product-list-title">Products</h1>
          <p className="product-list-subtitle">
            Manage and explore your products
          </p>
        </div>

        <span className="product-count">
          {data.length} products
        </span>
      </div>


       <div
      ref={parentRef}
      style={{
        height: "600px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {rowVirtualizer
          .getVirtualItems()
          .map((virtualRow) => {
            const product =
              data[virtualRow.index]

            return (
                <article
                  ref={rowVirtualizer.measureElement}
                  key={product._id}
                  className="product-card"
                  data-index={virtualRow.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
<div className="product-card-top">
  <span className="product-number">
    #{String(virtualRow.index + 1).padStart(2, "0")}
  </span>

  <span
    className={`product-stock ${
      product.stock > 0 ? "in-stock" : "out-of-stock"
    }`}
  >
    {product.stock > 0 ? "In stock" : "Out of stock"}
  </span>

  <Heart
    onClick={() => handleClick(product)}
    style={{ cursor: "pointer" }}
    color={check(product._id) ? "red" : "grey"}
    fill={check(product._id) ? "red" : "none"}
  />
</div>

<div className="product-card-content">
  <h2 className="product-name">{product.name}</h2>

  <p className="product-description">
    {product.description || "No description available."}
  </p>
</div>

<div className="product-card-footer">
  <div className="product-price-wrapper">
    <span className="product-price-label">Price</span>
    <p className="product-price">
      ${Number(product.price).toFixed(2)}
    </p>
  </div>

  <div className="product-stock-wrapper">
    <span className="product-price-label">Available</span>
    <p className="product-stock-count">
      {product.stock} units
    </p>
  </div>
</div>
              </article>
            )
          })}
      </div>
    </div>

      {data.length === 0 && (
        <div className="product-empty">
          <div className="product-empty-icon">📦</div>
          <h2>No products found</h2>
          <p>There are no products to display yet.</p>
        </div>
      )}
    </div>
  );
}
