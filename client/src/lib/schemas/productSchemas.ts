import { PRODUCT_CATEGORIES } from "@/constants/CategoryCons";
import { PRODUCT_ATTRIBUTE_RULES } from "@/constants/SubcategoryConst";
import z from "zod";

export const productSchema = z.object({
    name:z.string()
    .trim()
    .min(1,"Name must be between 1 and 100 characters")
    .max(100,"Name must be between 1 and 100 characters"),

    description:z.string()
    .trim()
    .min(1,"description is required")
    .max(2000,"Description must be less than 2000 characters"),

    price:z.number()
    .min(0,"price is required"),

    category: z.enum(
    Object.keys(PRODUCT_CATEGORIES) as [
        keyof typeof PRODUCT_CATEGORIES,
        ...(keyof typeof PRODUCT_CATEGORIES)[]
    ]
    ),

    subcategory: z
  .string()
  .min(1, "Subcategory is required"),

    attributes: z.record(z.string(), z.unknown()),

    stock: z
    .number()
    .int("stock must be an integer")
    .min(0, "stock must be a non-negative integer"),

    visibility: z
    .enum(["public", "private"])
}).superRefine((data, ctx) => {
  const categoryRules =
    PRODUCT_ATTRIBUTE_RULES[data.category]

  if (
    !PRODUCT_CATEGORIES[data.category].includes(
      data.subcategory
    )
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["subcategory"],
      message: "Invalid subcategory",
    })

    return
  }

  if (!(data.subcategory in categoryRules)) {
    ctx.addIssue({
      code: "custom",
      path: ["subcategory"],
      message: "Invalid subcategory",
    })

    return
  }

  const subcategory =
    data.subcategory as keyof typeof categoryRules

  const rules = categoryRules[subcategory]

  const attributes = data.attributes

  for(const[key,rule] of Object.entries(rules)){
    const value = attributes[key]

 if (
  rule.required &&
  (value === undefined || value === null || value === "")
) {
  ctx.addIssue({
    code: "custom",
    path: ["attributes", key],
    message: `${key} is required`,
  })

  continue
}

  if (
  value !== undefined &&
  value !== null &&
  typeof value !== rule.type
) {
  ctx.addIssue({
    code: "custom",
    path: ["attributes", key],
    message: `${key} must be of type ${rule.type}`,
  })
}

  }

})

export type ProductSchema = z.infer<typeof productSchema>