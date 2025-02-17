import { configureStore } from "@reduxjs/toolkit";
// ======
import commentSlice from "../features/comment/commentSlice";
import friendSlice from "../features/friend/friendSlice";
import postSlice from "../features/post/postSlice";
import userSlice from "../features/user/userSlice";
// ======

// Kết hợp các reducer con
const rootReducer = {
  comment: commentSlice,
  friend: friendSlice,
  post: postSlice,
  user: userSlice,
};

// Tạo store với rootReducer
const store = configureStore({
  reducer: rootReducer,
});

export default store;
