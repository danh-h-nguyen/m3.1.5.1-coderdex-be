import { Box, Stack } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
// ======
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";
import AlertMsg from "../components/AlertMsg";

// ======

function MainLayout() {
  return (
    <Stack sx={{ minHeight: "100vh" }}>
      <MainHeader />
      <AlertMsg />

      {/* Outlet: chứa nội dung của các trang (trong khái niệm của react-router-dom) */}
      <Outlet />

      {/* Box: có tác dụng đẩy MainFooter xuống dưới cùng, khi nội dung của trang không chiếm hết màn hình */}
      <Box sx={{ flexGrow: 1 }} />
      <MainFooter />
    </Stack>
  );
}

export default MainLayout;
