/* eslint-disable react/prop-types */
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold">${product?.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <button className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product.id);
              setFormData(product);
            }}
          >
            Edit
          </button>
          <button className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2" onClick={() => handleDelete(product.id)}>Delete</button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;