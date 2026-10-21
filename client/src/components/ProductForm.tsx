"use client"

import { PRODUCT_CATEGORIES } from "@/constants/CategoryCons"
import { PRODUCT_ATTRIBUTE_RULES } from "@/constants/SubcategoryConst"
import useCreateProduct from "@/hooks/query/mutation/useCreateProduct"
import useUpdateProduct from "@/hooks/query/mutation/useUpdateProduct"
import { productSchema, ProductSchema } from "@/lib/schemas/productSchemas"
import { createProduct, updateProduct } from "@/services/productService"
import { useStoreAuth } from "@/store/useStoreAuth"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

// interface IProductForm{
//     mode: "create" | "edit"
//     initialState?:ProductSchema
// }

interface IntImg {
  publicId:string;
  url:string
}

interface IProductForm {
  mode: "create" | "edit";
  slug?: string;
  initialState?: ProductSchema & {
    images?:IntImg[];
  };
}

interface LocalImage  {
  preview: string
  type: "existing" | "new"
  publicId?: string
  file?: File
}


export default function ProductForm({mode,initialState,slug}:IProductForm) {

const {
  register,
  handleSubmit,
  reset,
  watch,
  formState: { errors, isSubmitting, isDirty }
} = useForm<ProductSchema>({
  resolver: zodResolver(productSchema),
  defaultValues: initialState ?? {
  name: "",
  description: "",
  price: 0,
  category: "clothing",
  subcategory: "",
  attributes: {},
  stock: 0,
  visibility: "public",
}
})

const {mutateAsync} = useCreateProduct()
const {mutateAsync:mutateUpdate} = useUpdateProduct()

  const [keepImageId,setKeepImageId] = useState<string[]>(initialState?.images?.map((img) => img.publicId) ?? [])
  const [localImages,setLocalImages] = useState<LocalImage[]>(initialState?.images?.map((img) => ({
    preview:img.url,
    type:"existing",
    publicId:img.publicId
  })) ?? [])
  const [image,setImage] = useState<File[]>([])
  const [serverError,setServerError] = useState<string>("")
  const user = useStoreAuth((s) => s.user)


  const router = useRouter()
  
 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files ?? [])

  if (files.length + localImages.length > 5) {
    alert("You can upload a maximum of 5 images")
    return
  }

  const newLocalImages: LocalImage[] = files.map((file) => ({
    preview: URL.createObjectURL(file),
    type: "new",
    file
  }))

  setLocalImages((prev) => [
    ...prev,
    ...newLocalImages
  ])

  setImage((prev) => [
    ...prev,
    ...files
  ])

  e.target.value = ""
}

const removeImage = (img: LocalImage) => {
  setLocalImages((prev) =>
    prev.filter((item) => item !== img)
  )

  if (img.type === "existing") {
    setKeepImageId((prev) =>
      prev.filter((id) => id !== img.publicId)
    )

    return
  }

  if (img.file) {
    setImage((prev) =>
      prev.filter((file) => file !== img.file)
    )
  }

  URL.revokeObjectURL(img.preview)
}



  const category = watch('category')
  const subcategory = watch("subcategory")
const attributes =
  PRODUCT_ATTRIBUTE_RULES[category]?.[
    subcategory as keyof typeof PRODUCT_ATTRIBUTE_RULES[typeof category]
  ] ?? {}


const onSubmit = async (data: ProductSchema) => {
  if(!user){
    return 
  }

  try {
    if (mode === "create") {
      await mutateAsync({ data, image });
      router.replace("/products");
      setServerError("")
    } else if (mode === "edit") {
      if (!slug) {
        setServerError("Product slug is missing");
        return;
      }

     const result = await mutateUpdate({
        data,
        image,
        keepImageId,
        slug,
      });
      setServerError("")

      reset(result.product)
      setImage([])
      setKeepImageId(result.product?.images?.map((img:IntImg) => img.publicId) ?? [])
      setLocalImages(
  result.product?.images?.map((img: IntImg) => ({
    preview: img.url,
    type: "existing" as const,
    publicId: img.publicId
  })) ?? []
)
    }
  } catch (error) {
    console.error(error);
    setServerError("Something went wrong");
  }
}


//   return (
//    <form
//   onSubmit={handleSubmit(
//     onSubmit,
//     (validationErrors) => console.log("Validation errors:", validationErrors)
//   )}
// >

//         <div>
//             <label htmlFor="">Name</label>
//             <input type="text" placeholder="Name" {...register("name")}/>
//             {errors.name && (
//                     <p className="error-p">{errors.name.message}</p>
//             )}
//         </div>

//          <div>
//             <label htmlFor="">Description</label>
//             <input type="text" placeholder="Description" {...register("description")}/>
//             {errors.description && (
//                     <p className="error-p">{errors.description.message}</p>
//             )}
//         </div>

//         <div>
//             <label htmlFor="">Price</label>
//               <input
//                 type="number"
//                 placeholder="Price"
//                 {...register("price", { valueAsNumber: true })}
//               />            
//               {errors.price && (
//                     <p className="error-p">{errors.price.message}</p>
//               )}
//         </div>

//         <div>
//           <label htmlFor="">Category</label>
//           <select {...register("category")}>
//             <option value="">Select Option</option>
//             {Object.keys(PRODUCT_CATEGORIES).map((category) => (
//               <option key={category} value={category}>{category}</option>
//             ))}
//           </select>
//           {errors.category && (
//             <p className="error-p" >{errors.category.message}</p>
//           )}
//         </div>

//         <div>
//           <label htmlFor="">Subcategory</label>
//           <select  {...register("subcategory")}>
//             <option value="">Select Option</option>
//             {PRODUCT_CATEGORIES[category]?.map((sub) => (
//               <option key={sub} value={sub}>{sub}</option>
//             ))}
//           </select>
//           {errors.subcategory && (
//             <p className="error-p" >{errors.subcategory.message}</p>
//           )}
//         </div>

//         <div>
//           <label htmlFor="">Attributes</label>
//           {Object.entries(attributes).map(([key,rule]) => (
//             <div key={key}>
//                 <label htmlFor="">{key}</label>
//                 {rule.inputType === "select" ? (
//                     <select  {...register(`attributes.${key}`, {
//                 valueAsNumber: rule.type === "number",
//               })} >
//                       <option  value="">Select Option</option>
//                       {rule.options?.map((opt) => (
//                         <option key={opt} value={opt} >{opt}</option>
//                       ))}
//                     </select>
                    
//                 ) : (
//                   <input
                    
//                     type={rule.type === "number" ? "number" : "text"}
//                     {...register(`attributes.${key}`, {
//                       valueAsNumber: rule.type === "number",
//                     })}
//                   />
//                 )}
//                 {errors.attributes && (
//                <p className="error-p" >{errors.attributes[key]?.message}</p>
//              )}
//             </div>

//           ))}
          
//         </div>

//         <div>
//             <label >Stock</label>
//             <input type="number" placeholder="Price" {...register("stock", { valueAsNumber: true })} />
//             {errors.stock && (
//                     <p className="error-p">{errors.stock.message}</p>
//             )}
//         </div>

//         <div>
//             <label htmlFor="">visibility</label>
//             <div>
//   <label>
//     <input type="radio" value="public" {...register("visibility")} />
//     Public
//   </label>

//   <label>
//     <input type="radio" value="private" {...register("visibility")} />
//     Private
//   </label>

//   {errors.visibility && <p className="error-p">{errors.visibility.message}</p>}
// </div>

//             <div>
//               <input
//                 type="file"
//                 accept="image/jpeg,image/png,image/webp"
//                 multiple
//                 onChange={handleChange}
//               />

//               <div>
//                 {localImages.map((img) => (
//                   <div key={img.preview}> 
//                     <Image src={img.preview} alt="img" width={200} height={200}/>
//                       <button
//         type="button"
//         onClick={() => removeImage(img)}
//       >
//         X
//       </button>
//                   </div>
//                 ))}
                
//               </div>

//             </div>


//         </div>

//         <button
//         style={{cursor:"pointer"}}
//          disabled={isSubmitting }
//         >{isSubmitting ? <span className="spinner"></span> : mode}
//         </button>

//         {serverError && (
//           <p>{serverError}</p>
//         )}
        
//     </form>
//   )

return (
  <form
    className="product-form"
    onSubmit={handleSubmit(
      onSubmit,
      (validationErrors) =>
        console.log("Validation errors:", validationErrors)
    )}
  >
    <div className="form-header">
      <div>
        <span className="form-eyebrow">PRODUCT MANAGEMENT</span>
        <h1>{mode === "create" ? "Create product" : "Edit product"}</h1>
        <p>
          {mode === "create"
            ? "Add a new product to your store."
            : "Update your product information."}
        </p>
      </div>

      <span className="form-mode">
        {mode === "create" ? "New product" : "Editing"}
      </span>
    </div>

    <div className="form-section">
      <div className="section-heading">
        <span className="section-number">01</span>
        <div>
          <h2>Basic information</h2>
          <p>Enter the main details of your product.</p>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="name">Product name</label>
        <input
          id="name"
          type="text"
          placeholder="e.g. Classic Cotton T-Shirt"
          {...register("name")}
        />
        {errors.name && (
          <p className="error-p">{errors.name.message}</p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe your product..."
          {...register("description")}
        />
        {errors.description && (
          <p className="error-p">{errors.description.message}</p>
        )}
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="price">Price</label>
          <div className="input-with-prefix">
            <span>$</span>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              {...register("price", { valueAsNumber: true })}
            />
          </div>
          {errors.price && (
            <p className="error-p">{errors.price.message}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="stock">Stock quantity</label>
          <input
            id="stock"
            type="number"
            min="0"
            placeholder="0"
            {...register("stock", { valueAsNumber: true })}
          />
          {errors.stock && (
            <p className="error-p">{errors.stock.message}</p>
          )}
        </div>
      </div>
    </div>

    <div className="form-section">
      <div className="section-heading">
        <span className="section-number">02</span>
        <div>
          <h2>Category & attributes</h2>
          <p>Organize your product and specify its details.</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="category">Category</label>
          <select id="category" {...register("category")}>
            <option value="">Select category</option>
            {Object.keys(PRODUCT_CATEGORIES).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="error-p">{errors.category.message}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="subcategory">Subcategory</label>
          <select id="subcategory" {...register("subcategory")}>
            <option value="">Select subcategory</option>
            {PRODUCT_CATEGORIES[category]?.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
          {errors.subcategory && (
            <p className="error-p">{errors.subcategory.message}</p>
          )}
        </div>
      </div>

      {Object.keys(attributes).length > 0 && (
        <div className="attributes-wrapper">
          <h3>Product specifications</h3>

          <div className="form-grid">
            {Object.entries(attributes).map(([key, rule]) => (
              <div className="form-field" key={key}>
                <label htmlFor={`attribute-${key}`}>{key}</label>

                {rule.inputType === "select" ? (
                  <select
                    id={`attribute-${key}`}
                    {...register(`attributes.${key}`, {
                      valueAsNumber: rule.type === "number",
                    })}
                  >
                    <option value="">Select option</option>
                    {rule.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`attribute-${key}`}
                    type={rule.type === "number" ? "number" : "text"}
                    {...register(`attributes.${key}`, {
                      valueAsNumber: rule.type === "number",
                    })}
                  />
                )}

                {errors.attributes?.[key] && (
                  <p className="error-p">
                    {errors.attributes[key]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    <div className="form-section">
      <div className="section-heading">
        <span className="section-number">03</span>
        <div>
          <h2>Product images</h2>
          <p>Upload up to 5 images. JPG, PNG or WebP.</p>
        </div>
      </div>

      <label className="upload-area" htmlFor="product-images">
        <span className="upload-icon">↑</span>
        <span className="upload-title">Choose product images</span>
        <span className="upload-description">
          Click to browse files from your device
        </span>
        <span className="upload-limit">
          {localImages.length} / 5 images selected
        </span>
      </label>

      <input
        className="file-input-hidden"
        id="product-images"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleChange}
      />

      {localImages.length > 0 && (
        <div className="image-grid">
          {localImages.map((img, index) => (
            <div className="image-card" key={img.preview}>
              <Image
                className="product-preview"
                src={img.preview}
                alt={`Product image ${index + 1}`}
                width={200}
                height={200}
                unoptimized={img.type === "new"}
              />

              <span
                className={`image-badge ${
                  img.type === "existing" ? "existing-badge" : ""
                }`}
              >
                {img.type === "existing" ? "Saved" : "New"}
              </span>

              <button
                className="remove-image"
                type="button"
                aria-label="Remove image"
                onClick={() => removeImage(img)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="form-section">
      <div className="section-heading">
        <span className="section-number">04</span>
        <div>
          <h2>Visibility</h2>
          <p>Choose who can see this product in your store.</p>
        </div>
      </div>

      <div className="visibility-options">
        <label className="visibility-option">
          <input
            type="radio"
            value="public"
            {...register("visibility")}
          />
          <span className="visibility-indicator" />
          <span className="visibility-copy">
            <strong>Public</strong>
            <small>Visible to customers</small>
          </span>
        </label>

        <label className="visibility-option">
          <input
            type="radio"
            value="private"
            {...register("visibility")}
          />
          <span className="visibility-indicator" />
          <span className="visibility-copy">
            <strong>Private</strong>
            <small>Hidden from customers</small>
          </span>
        </label>
      </div>

      {errors.visibility && (
        <p className="error-p">{errors.visibility.message}</p>
      )}
    </div>

    {serverError && (
      <div className="server-error" role="alert">
        {serverError}
      </div>
    )}

    <div className="form-footer">
      <p className="footer-note">
        Please review your product details before saving.
      </p>

      <button
        className="submit-button"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner" />
            Saving...
          </>
        ) : mode === "create" ? (
          "Create product →"
        ) : (
          "Save changes →"
        )}
      </button>
    </div>
  </form>
)
}
