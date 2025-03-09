/* eslint-disable react/prop-types */
import { AlignJustify, ArrowRight } from "lucide-react";

// import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/auth-slice";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-4 py-3">
      <button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </button>
      <div className="flex flex-1 justify-end">
        <button  onClick={handleLogout} className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
          <ArrowRight className="w-4 h-4" /> Logout
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
