import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  // DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch } from "react-redux";
import { deletePost } from "./postSlice";
import PostForm from "./PostForm";

const MyMoreVertIcon = ({ post }) => {
  // State để điều khiển menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false); // State mở modal

  const dispatch = useDispatch();

  // Mở menu khi nhấn vào nút
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Đóng menu khi nhấn ra ngoài
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Mở modal edit
  const handleEdit = () => {
    setOpen(true); // Mở modal
    handleClose(); // Đóng menu sau khi chọn Edit
  };

  // Đóng modal
  const handleCloseDialog = () => {
    setOpen(false);
  };

  // Xử lý xóa bài viết
  const handleDelete = () => {
    dispatch(deletePost(post._id));
    handleClose(); // Đóng menu sau khi chọn Delete
  };

  return (
    <div>
      {/* IconButton để mở menu */}
      <IconButton onClick={handleClick}>
        <MoreVertIcon sx={{ fontSize: 30 }} />
      </IconButton>

      {/* Menu xổ xuống */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      {/* Dialog chỉnh sửa bài viết */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          {/* Truyền post vào PostForm */}
          <PostForm post={post} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyMoreVertIcon;
