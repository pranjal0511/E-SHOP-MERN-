/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({isAuthenticated , user, children}) => {
  const location = useLocation();

  console.log("isAuthenticated",isAuthenticated);
  console.log("location.pathname ",location.pathname);
  console.log("user?.role",user?.role)

  if (location.pathname === "/") {
    console.log("1")
    //!isAuthenticated => user is not authorized
    //isAuthenticated => user is authorized
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  if (
   
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    console.log("2")
    return <Navigate to="/auth/login" />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      console.log("3")
      return <Navigate to="/admin/products" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    console.log("77")
    return <Navigate to="/unauth-page" />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    console.log("5")
    return <Navigate to="/admin/products"/>;
  }

  return <>{children}</>;
}

export default CheckAuth;