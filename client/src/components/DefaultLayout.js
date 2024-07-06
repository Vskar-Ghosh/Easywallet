import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DefaultLayout = ({ children }) => {
  const { user } = useSelector((state) => state.users);
  const [collasped, setCollasped] = useState(false);

  const navigate = useNavigate();

  const userMenu = [
    {
      title: "Home",
      icon: <i class="ri-home-7-line"></i>,
      onclick: () => navigate("/"),
      path: "/",
    },
    {
      title: "Transactions",
      icon: <i class="ri-bank-fill"></i>,
      onclick: () => navigate("/transactions"),
      path: "/transactions",
    },
    {
      title: "Requests",
      icon: <i class="ri-hand-heart-line"></i>,
      onclick: () => navigate("/requests"),
      path: "/requests",
    },
    {
      title: "Logout",
      icon: <i class="ri-logout-box-line"></i>,
      onclick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
      path: "/logout",
    },
  ];
  const adminMenu = [
    {
      title: "Home",
      icon: <i class="ri-home-7-line"></i>,
      onclick: () => navigate("/"),
      path: "/",
    },
    {
      title: "Users",
      icon: <i class="ri-user-settings-line"></i>,
      onclick: () => navigate("/users"),
      path: "/users",
    },
    {
      title: "Transactions",
      icon: <i class="ri-bank-fill"></i>,
      onclick: () => navigate("/transactions"),
      path: "/transactions",
    },
    {
      title: "Requests",
      icon: <i class="ri-hand-heart-line"></i>,
      onclick: () => navigate("/requests"),
      path: "/requests",
    },
    {
      title: "Logout",
      icon: <i class="ri-logout-box-line"></i>,
      onclick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
      path: "/logout",
    },
  ];
  const menuToRender = user?.isAdmin ? adminMenu : userMenu;
  return (
    <div className="layout">
      <div className="sidebar">
        <div className="menu">
          {menuToRender.map((item, i) => {
            const isActive = window.location.pathname === item.path;
            return (
              <div
                key={i}
                className={`menu-item ${isActive ? "active-menu-item" : ""}`}
                onClick={item.onclick}
              >
                {item.icon}
                {!collasped && (
                  <h1 className="text-sm text-white">{item.title}</h1>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="body">
        <div className="header flex justify-between items-center">
          <div className="text-white">
            {!collasped && (
              <i
                class="ri-close-large-line"
                onClick={() => setCollasped(!collasped)}
              ></i>
            )}
            {collasped && (
              <i
                class="ri-menu-2-line"
                onClick={() => setCollasped(!collasped)}
              ></i>
            )}
          </div>
          <div>
            <h1 className="text-xl text-white">EasyWallet</h1>
          </div>
          <div className=" text-sm underline text-white">
            {user?.firstName}
            {user?.lastName}
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default DefaultLayout;
