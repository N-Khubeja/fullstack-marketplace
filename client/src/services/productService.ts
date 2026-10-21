import { api } from "@/lib/api"
import { ProductSchema } from "@/lib/schemas/productSchemas"

interface ICreateProduct {
  data: ProductSchema
  image: File[]
}

export interface IupdateProduct {
  data: ProductSchema
  image: File[]
  keepImageId:string[]
  slug:string
}

export interface IProductProps{
  page?:number
  search?:string
  category?:string
  subcategory?:string
  minPrice?:number 
  maxPrice?:number
  sortBy?:string
  order?:string
}

export  interface IProduct extends ProductSchema{
  slug:string
  images:{
    url:string
    publicId:string
  }[]
  _id:string
}

interface ProductsResponse {
  products: IProduct[]
  pagination: {
    page: number
    limit: number
    totalProducts: number
    totalPages: number
  }
}
export const createProduct = async ({
  data,
  image
}: ICreateProduct) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) return

    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value))
      return
    }

    formData.append(key, String(value))
  })

  image.forEach((file) => {
    formData.append("images", file)
  })

  const result = await api.post(
    "/product/create",
    formData
  )

  return result.data
}


export const updateProduct = async ({data,image,keepImageId,slug}:IupdateProduct) => {
    const formData = new FormData()

    Object.entries(data).forEach(([key,value]) => {
        if(value === undefined) return

        if(typeof value === "object"){
            formData.append(key,JSON.stringify(value))

            return
        }

        formData.append(key,String(value))
    })

    image.forEach((img) => {
        formData.append("images",img)
    })

    formData.append(
  "retainedImageIds",
  JSON.stringify(keepImageId)
)

    const result = await api.patch(`/update/${slug}`,
        formData,
    )

    return result.data
}

const LIMIT = 20

export const getProducts = async ({
  page = 1,
  category,
  maxPrice,
  minPrice,
  order,
  search,
  sortBy,
  subcategory,
}: IProductProps) => {
  const params = new URLSearchParams()

  params.set("page", String(page))
  params.set("limit", String(LIMIT))

  if (search) {
    params.set("search", search)
  }

  if (category) {
    params.set("category", category)
  }

  if (subcategory) {
    params.set("subcategory", subcategory)
  }

  if (maxPrice != null) {
    params.set("maxPrice", String(maxPrice))
  }

  if (minPrice != null) {
    params.set("minPrice", String(minPrice))
  }

  if (sortBy) {
    params.set("sortBy", sortBy)
  }

  if (order) {
    params.set("order", order)
  }

  const result = await api.get<ProductsResponse>(`/product?${params.toString()}`)

  return result.data
}


export const getFavoriteProducts = async () => {
  const result = await api.get("/product/get-favorites")
  return result.data.products
}


export const ToggleFavorite = async (id:string) => {
  const result = await api.post("/product/toggle-favorite-prod",{ id })
  return result.data
}

