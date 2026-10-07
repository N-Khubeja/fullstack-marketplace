const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary")
const streamifier = require("streamifier") 
const mongoose = require("mongoose");
const PRODUCT_CATEGORIES = require("../constants/Categories");

async function getAllProducts(req, res) {

  try {

    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    )
    const search = req.query.search
    const category = req.query.category
    const subcategory = req.query.subcategory
    const minPrice =
  req.query.minPrice !== undefined
    ? Number(req.query.minPrice)
    : NaN

const maxPrice =
  req.query.maxPrice !== undefined
    ? Number(req.query.maxPrice)
    : NaN
    const sortBy = req.query.sortBy
    const order = req.query.order

    const skip = (page-1)*limit

    let sort = {
      createdAt:-1
    }

    const allowedSortFields = ["price","name","createdAt"]

    const filters = {
      isActive: true,
      visibility: "public"
    }

    if (search) {
      filters.name = {
        $regex: search,
        $options: "i"
      }
    }

    if(category){
      filters.category = category
    }

    if(subcategory){
      filters.subcategory = subcategory
    }

   if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
  filters.price = {}

  if (!Number.isNaN(minPrice)) {
    filters.price.$gte = minPrice
  }

  if (!Number.isNaN(maxPrice)) {
    filters.price.$lte = maxPrice
  }
}

  if(sortBy && allowedSortFields.includes(sortBy)){
    sort = {
      [sortBy]: order === 'asc' ? 1 : -1
    }
  }


    const [totalProducts,products] = await Promise.all([
      Product.countDocuments(filters),
      Product.find(filters).sort(sort).skip(skip).limit(limit)
    ])

    const totalPages = Math.ceil(totalProducts/limit)
    
    return res.status(200).json({
        products,
        pagination:{
          page,
          limit,
          totalProducts,
          totalPages
        }
    })

   } catch (error) {
      console.error("Get products error:", error)

    return res.status(500).json({
      message: "Something went wrong"
    })
   }
}


async function getOneProduct(req,res){
  const {slug} = req.params

  try {
    const singleProduct = await Product.findOne({slug,isActive:true,visibility:"public"})
    if(!singleProduct){
      return res.status(404).json({message:"there is no product"})
    }

    return res.status(200).json({
      singleProduct
    })
  } catch (error) {
    console.error("Get product error:", error)

  return res.status(500).json({
    message: "Something went wrong"
  })
  }
}


async function createProduct(req, res) {

  let uploadedPublicIds = []

 try {
     const user = req.user
  const {name,description,price,category,subcategory,stock,attributes,visibility} = req.body
  const productId = new mongoose.Types.ObjectId()

//    const  results = await Promise.all(
//     req.files.map((file) => {
//         return new Promise((resolve, reject) => {
//             const stream = cloudinary.uploader.upload_stream(
//                 {
//                     asset_folder: `products/${user._id}/${productId}`
//                 },
//                 (error, result) => {
//                     if (error) return reject(error);
//                     uploadedImages.push(result.public_id)
//                     resolve(result);
//                 }
//             );

//             streamifier
//                 .createReadStream(file.buffer)
//                 .pipe(stream);
//         });
//     })
// );


const results = await Promise.allSettled(
  req.files.map((file) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          asset_folder: `products/${user._id}/${productId}`
        },
        (error, result) => {
          if (error) {
            return reject(error)
          }

          resolve(result)
        }
      )

      streamifier
        .createReadStream(file.buffer)
        .pipe(stream)
    })
  })
)

const successfulUploads = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value)

    uploadedPublicIds = successfulUploads.map(
      (result) => result.public_id
    )

    const hasFailedUpload = results.some(
      (result) => result.status === "rejected"
    )

    if (hasFailedUpload) {
      throw new Error("One or more images failed to upload")
    }



const images = successfulUploads.map((result) => ({
    url: result.secure_url,
    publicId: result.public_id
}));

const makeSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

async function createUniqueSlug(name) {
  const baseSlug = makeSlug(name)

  let slug = baseSlug
  let counter = 2

  while (await Product.exists({ slug })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

const slug = await createUniqueSlug(name)

    const product = await Product.create({
    _id:productId,
    name,
    slug,
    description,
    price,
    category,
    subcategory,
    stock,
    attributes,
    images:images,
    author:user._id,
    visibility,
  })


   return res.status(201).json({
      message: "Product has been added successfully",
      product
    })
 } catch (error) {
  
if (uploadedPublicIds.length > 0) {
      await Promise.allSettled(
        uploadedPublicIds.map((publicId) =>
          cloudinary.uploader.destroy(publicId)
        )
      )
    }

  console.error("Create product error:", error)

    return res.status(500).json({
      message: "Failed to create product"
    })
  
 }
}

async function getMyProducts(req,res){

    const visibility = req.query.visibility
    const isActive = req.query.isActive
    const search = req.query.search
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    )
    const skip = (page-1)*limit

    try {

    const filters = {
      author: req.user._id
    } 
    
    if (visibility) {
      if (!["public", "private"].includes(visibility)) {
        return res.status(400).json({
          message: "Invalid visibility"
        })
      }

      filters.visibility = visibility
    }


    if (search) {
      filters.name = {
        $regex: search,
        $options: "i"
      }
    }

      if (isActive === "true") {
    filters.isActive = true
  }

  if (isActive === "false") {
    filters.isActive = false
  }

    const [totalProducts,MyProducts] = await Promise.all([
      Product.countDocuments(filters),
      Product.find(filters).skip(skip).sort({ createdAt: -1 }).limit(limit)
    ])

    const totalPages = Math.ceil(totalProducts/limit)

return res.status(200).json({
  products: MyProducts,
  pagination: {
    page,
    limit,
    totalProducts,
    totalPages
  }
})

    } catch (error) {
      console.error("Get products error:", error)

    return res.status(500).json({
      message: "Something went wrong"
    })
    }
}

async function updateProduct(req,res){
  const user = req.user
  const slug = req.params.slug

  let uploadedPublicIds = []
  let productUpdated = false


  
  try {
    
    const product = await Product.findOne({slug})

  if (!product || !product.author.equals(user._id)){
    return res.status(404).json({
      message: "Product not found"
    })
  }

  const oldImages = product.images ?? []
const oldImageIds = oldImages.map(
  (img) => img.publicId
)

  const {retainedImageIds} = req.body

    const allowedFields = [
    "name",
    "description",
    "price",
    "category",
    "subcategory",
    "stock",
    "attributes",
    "visibility",
    "isActive"
  ]

  const categoryChanged =
  req.body.category !== undefined &&
  req.body.category !== product.category

const subcategoryChanged =
  req.body.subcategory !== undefined &&
  req.body.subcategory !== product.subcategory

  if (
  (categoryChanged || subcategoryChanged) &&
  req.body.attributes === undefined
) {
  return res.status(400).json({
    message:
      "Attributes are required when category or subcategory changes"
  })
}

  const finalCategory =
  req.body.category ?? product.category

const finalSubcategory =
  req.body.subcategory ?? product.subcategory

const finalAttributes =
  req.body.attributes ?? product.attributes


if (!PRODUCT_CATEGORIES[finalCategory]) {
  return res.status(400).json({
    message: "Invalid category"
  })
}


if (
  !PRODUCT_CATEGORIES[finalCategory].includes(finalSubcategory)
) {
  return res.status(400).json({
    message: "This subcategory does not belong to category"
  })
}


const rules =
  PRODUCT_ATTRIBUTE_RULES[finalSubcategory]

if (!rules) {
  return res.status(400).json({
    message: "No attribute rules found for this subcategory"
  })
}


if (
  !finalAttributes ||
  typeof finalAttributes !== "object" ||
  Array.isArray(finalAttributes)
) {
  return res.status(400).json({
    message: "Attributes must be an object"
  })
}


for (const [key, rule] of Object.entries(rules)) {
  const value =
    finalAttributes instanceof Map
      ? finalAttributes.get(key)
      : finalAttributes[key]


  if (
    rule.required &&
    (
      value === undefined ||
      value === null ||
      value === ""
    )
  ) {
    return res.status(400).json({
      message: `${key} is required`
    })
  }


  if (
    value !== undefined &&
    value !== null &&
    typeof value !== rule.type
  ) {
    return res.status(400).json({
      message: `${key} must be of type ${rule.type}`
    })
  }
}

  let updates = {}

  for(const field of allowedFields){
      if(req.body[field] !== undefined){
        updates[field] = req.body[field]
      }
  }


let parsedRetainedImageIds =
  retainedImageIds === undefined
    ? oldImageIds
    : retainedImageIds

if (typeof retainedImageIds === "string") {
  try {
    parsedRetainedImageIds = JSON.parse(retainedImageIds)
  } catch {
    return res.status(400).json({
      message: "retainedImageIds must be valid JSON"
    })
  }
}

if (!Array.isArray(parsedRetainedImageIds)) {
  return res.status(400).json({
    message: "retainedImageIds must be an array"
  })
}

const hasInvalidRetainedId = parsedRetainedImageIds.some(
  (id) => !oldImageIds.includes(id)
)

if (hasInvalidRetainedId) {
  return res.status(400).json({
    message: "One or more images do not belong to this product"
  })
}

const removedImageIds = oldImageIds.filter(
  (id) => !parsedRetainedImageIds.includes(id)
)


const hasRemovedImages = removedImageIds.length > 0

  const hasNewFiles =
  Array.isArray(req.files) &&
  req.files.length > 0

  const hasFieldChanges =
  Object.keys(updates).length > 0

  const hasImageChanges =
  hasNewFiles || hasRemovedImages

  if (!hasFieldChanges && !hasImageChanges) {
  return res.status(400).json({
    message: "Nothing to update"
  })
}


        const remainingOldImages = product.images.filter(
      (img) => parsedRetainedImageIds.includes(img.publicId)
    )

const newFilesCount = req.files?.length ?? 0

const finalImagesCount =
  remainingOldImages.length + newFilesCount

if (finalImagesCount > 5) {
  return res.status(400).json({
    message: "Product can have a maximum of 5 images"
  })
}


  if(hasNewFiles){




    const results = await Promise.allSettled(
      req.files.map((file) => {
        return new Promise((resolve,reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              asset_folder: `products/${user._id}/${product._id}`
            },
            (error, result) => {
              if (error) {
                return reject(error)
              }

              resolve(result)
            }
          )

           streamifier
            .createReadStream(file.buffer)
            .pipe(stream)
        }) 
      })
    )

    const successfulUploads = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value)

    uploadedPublicIds = successfulUploads.map(
      (result) => result.public_id
    )

    const hasFailedUpload = results.some(
      (result) => result.status === "rejected"
    )

    if (hasFailedUpload) {
      throw new Error("One or more images failed to upload")
    }
    const newImages = successfulUploads.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id
    }))
    
    updates.images = [
      ...remainingOldImages,
      ...newImages
    ]
    
    
  } else {


    
    updates.images = remainingOldImages
    

  }
  

  const updatedProduct = await Product.findByIdAndUpdate(
    product._id,
    updates,
            {
        new: true,
        runValidators: true
    }
  )

      if (!updatedProduct) {
            return res.status(404).json({ message: "product not found" });
        }

        productUpdated = true

     await Promise.allSettled(
  removedImageIds.map((id) =>
    cloudinary.uploader.destroy(id)
  )
)

      return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    })

  } catch (error) {


if (!productUpdated && uploadedPublicIds.length > 0) {
  await Promise.allSettled(
    uploadedPublicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId)
    )
  )
}

  console.error("Update product error:", error)

    return res.status(500).json({
      message: "Failed to Update product"
    })
  
    
  }
  

}



module.exports = {
  getAllProducts,
  getOneProduct,
  createProduct,
  getMyProducts,
  updateProduct
};