import { Fragment, useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import UploadImages from "../../components/admin-view/upload-images";
import { useDispatch, useSelector } from "react-redux";
import AdminProductTile from "../../components/admin-view/product-tile";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "../../store/products-slice";

const schema = z.object({
  title: z.string().min(1, "Please enter a product title"),
  description: z.string().min(1, "Please enter a product description"),
  category: z.string().min(1, "Please select a category"),
  brand: z.string().min(1, "Please select a brand"),
  price: z.string().min(1, "Please enter a product price"),
  salePrice: z.string().min(1, "Please enter a product sale price"),
  totalStock: z.string().min(1, "Please enter a product totalStock"),
});

const AdminProducts = () => {
  const categories = ["Men", "Women", "Kids", "Accessories", "Footware"];
  const brands = ["Adidas", "Nike", "Puma", "Levi's", "Zara", "H&M"];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { category: "", brand: "", image: "" }, // <-- Initialize category field
  });

  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);
  console.log("productList", productList);

  const [openAddNewProductDialog, setOpenAddNewProductDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Select Category");
  const [selectedBrand, setSelectedBrand] = useState("Select Brand");

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  console.log("currentEditedId", currentEditedId);

  const onSubmit = (formData, event) => {
    event.preventDefault();
    console.log("Form Data with Image:", formData);
    console.log("uploadedImageUrl:", uploadedImageUrl);

    currentEditedId == null ?
    dispatch(
      addNewProduct({
        ...formData,
        image: uploadedImageUrl,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        setOpenAddNewProductDialog(false);
        setImageFile(null);
        setSelectedCategory("Select Category"); // Reset the selected category
        setSelectedBrand("Select Brand"); // Reset the selected brand
        reset(); // reset the all filed
        console.log("Product add successfully");
      }
    })  :
    console.log("edit do",currentEditedId) 
    dispatch(
        editProduct({
          id: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenAddNewProductDialog(false);
          setCurrentEditedId(null);
        }
      });
  };

  const handleDelete = (getCurrentProductId)=> {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (currentEditedId !== null) {
      const product = productList.find((p) => p.id === currentEditedId);
      if (product) {
        setSelectedCategory(product.category); // Set selected category
        setSelectedBrand(product.brand); // Set selected brand
        setUploadedImageUrl(product.image); // Set uploaded image URL if needed

        // Populate form fields using setValue
        setValue("title", product.title);
        setValue("description", product.description);
        setValue("price", product.price);
        setValue("salePrice", product.salePrice);
        setValue("totalStock", product.totalStock);
      }
    }
  }, [currentEditedId, productList, setValue]);

  return (
    <Fragment>
      <Dialog.Root
        open={openAddNewProductDialog}
        onOpenChange={setOpenAddNewProductDialog}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
          <Dialog.Content className="fixed right-0 top-0 h-full w-[500px] bg-white p-6 shadow-lg focus:outline-none animate-slideInFromLeft overflow-y-auto max-h-screen">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900">
                {currentEditedId ? "Edit Product" : "Add New Product"}
              </h1>
              <button onClick={() => setOpenAddNewProductDialog(false)}>
                <IoMdClose
                  size={24}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                />
              </button>
            </div>

            <form className="mt-1" onSubmit={handleSubmit(onSubmit)}>
              <UploadImages
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isEditMode={currentEditedId !== null}
              />
              <div className="mb-1">
                <label className="block text-gray-700">Title</label>
                <input
                  {...register("title")}
                  type="text"
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Enter Product Title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>
              <div className="mb-1">
                <label className="block text-gray-700">Description</label>
                <input
                  {...register("description")}
                  type="text"
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Enter Product Description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="mb-1">
                <label className="block text-gray-700">Category</label>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      type="button"
                      className="flex items-center justify-between w-full px-4 py-2 bg-white border border-black-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <span>{selectedCategory}</span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="start"
                      sideOffset={5}
                      className="w-full min-w-[200px] bg-white border border-gray-200 rounded-md shadow-lg"
                    >
                      {categories.map((category) => (
                        <DropdownMenu.Item
                          key={category}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer w-full"
                          onSelect={() => {
                            setSelectedCategory(category);
                            setValue("category", category); // <-- Update form field
                          }}
                        >
                          {category}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
                {errors.category && (
                  <p className="text-red-500 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="mb-1">
                <label className="block text-gray-700">Brand</label>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      type="button"
                      className="flex items-center justify-between w-full px-4 py-2 bg-white border border-black-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <span>{selectedBrand}</span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="start"
                      sideOffset={5}
                      className="w-full min-w-[200px] bg-white border border-gray-200 rounded-md shadow-lg"
                    >
                      {brands.map((brand) => (
                        <DropdownMenu.Item
                          key={brand}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer w-full"
                          onSelect={() => {
                            setSelectedBrand(brand);
                            setValue("brand", brand); // <-- Update form field
                          }}
                        >
                          {brand}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
                {errors.brand && (
                  <p className="text-red-500 text-sm">{errors.brand.message}</p>
                )}
              </div>
              <div className="mb-1">
                <label className="block text-gray-700">Price</label>
                <input
                  {...register("price")}
                  type="text"
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Enter Product Price"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>
              <div className="mb-1">
                <label className="block text-gray-700">Sale Price</label>
                <input
                  {...register("salePrice")}
                  type="text"
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Enter Product Sale Price"
                />
                {errors.salePrice && (
                  <p className="text-red-500 text-sm">
                    {errors.salePrice.message}
                  </p>
                )}
              </div>

              <div className="mb-1">
                <label className="block text-gray-700">totalStock</label>
                <input
                  {...register("totalStock")}
                  type="text"
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Enter Product totalStock"
                />
                {errors.totalStock && (
                  <p className="text-red-500 text-sm">
                    {errors.totalStock.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 mt-4 text-white bg-black rounded-md hover:bg-black"
              >
               {currentEditedId === null?  "Add" : "Edit"} 
              </button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div className="mb-5 w-full flex justify-end">
        <button
          onClick={() => {
            setOpenAddNewProductDialog(true);
            reset();
            setSelectedCategory("selectedCategory")
            setSelectedBrand("select brand");
            setCurrentEditedId(null)
          }}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black-600 transition-colors"
        >
          Add New Product
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem.id}
                product={productItem}
                setOpenCreateProductsDialog={setOpenAddNewProductDialog}
                setCurrentEditedId={setCurrentEditedId}
                handleDelete= {handleDelete}
              />
            ))
          : null}
      </div>
    </Fragment>
  );
};

export default AdminProducts;
