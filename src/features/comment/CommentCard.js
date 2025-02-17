import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// ======
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";
import { deleteComment } from "./commentSlice";
// ======

function CommentCard({ comment, postId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  // Mở menu khi nhấn vào nút
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Đóng menu khi nhấn ra ngoài
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle Delete Comment
  const handleDelete = (commentId) => {
    dispatch(deleteComment(postId, commentId));
    handleClose(); // Đóng menu sau khi chọn
  };

  return (
    <Stack direction="row" spacing={2}>
      <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />

      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background-neutral" }}>
        <Stack
          direction="row"
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {comment.author?.name}
          </Typography>

          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {fDate(comment.createdAt)}
          </Typography>
        </Stack>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {comment.content}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <CommentReaction comment={comment} />

          {/* More options button */}
          <IconButton onClick={handleClick}>
            <MoreVertIcon sx={{ fontSize: 30 }} />
          </IconButton>

          {/* Menu for edit and delete */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleDelete.bind(null, comment._id)}>
              Delete
            </MenuItem>
          </Menu>
        </Box>
      </Paper>
    </Stack>
  );
}

export default CommentCard;
