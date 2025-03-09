/* eslint-disable react/prop-types */
import {
  // BadgeCheck,
  ChartNoAxesCombined,
  // LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import * as Dialog from "@radix-ui/react-dialog";

const adminSidebarMenuItems = [
  // {
  //   id: "dashboard",
  //   label: "Dashboard",
  //   path: "/admin/dashboard",
  //   icon: <LayoutDashboard />,
  // },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  // {
  //   id: "orders",
  //   label: "Orders",
  //   path: "/admin/orders",
  //   icon: <BadgeCheck />,
  // },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  console.log("open  ...", open);
  const navigate = useNavigate();

  return (
    <Fragment>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60" />

          <Dialog.Content className="fixed left-0 top-0 h-full w-[300px] bg-white p-6 shadow-lg focus:outline-none animate-slideInFromLeft">
            {/* Close Button */}
            <div className="flex justify-end">
              <button onClick={() => setOpen(false)}>
                <IoMdClose
                  size={24}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                />
              </button>
            </div>

            {/* Admin Panel Header */}
            <div className="mt-4 flex flex-col items-start space-y-3">
              <ChartNoAxesCombined size={28} className="text-gray-700" />
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>

            {/* Menu Items */}
            <div className="mt-6">
              <MenuItems setOpen={setOpen} />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}
export default AdminSideBar;
