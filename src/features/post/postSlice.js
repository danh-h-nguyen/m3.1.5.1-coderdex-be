import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { POST_PER_PAGE } from "../../app/config";
import { cloudinaryUpload } from "../../utils/cloudinary";

const initialState = {
  isLoading: false,
  error: null,
  postsById: {},
  currentPagePosts: [],
};

const slice = createSlice({
  name: "post",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      // thêm từ phần List of Posts => mục đích: tự động render khi add newpost
      if (state.currentPagePosts.length % POST_PER_PAGE === 0)
        state.currentPagePosts.pop();
      const newPost = action.payload;
      state.postsById[newPost._id] = newPost;
      state.currentPagePosts.unshift(newPost._id);
    },

    // thêm từ phần List of Posts
    getPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { count, posts } = action.payload;
      posts.forEach((post) => {
        state.postsById[post._id] = post;
        if (!state.currentPagePosts.includes(post._id))
          state.currentPagePosts.push(post._id);
      });
      state.totalPosts = count; // thêm từ phần List of Posts => mục đích: đếm coi có bao nhiêu post
    },

    sendPostReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { postId, reactions } = action.payload;
      state.postsById[postId].reactions = reactions;
    },

    resetPosts(state, action) {
      state.postsById = {};
      state.currentPagePosts = [];
    },

    // Bổ sung reducer deletePostSuccess
    deletePostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const postId = action.payload;
      delete state.postsById[postId]; // Xóa bài viết khỏi postsById
      state.currentPagePosts = state.currentPagePosts.filter(
        (id) => id !== postId
      ); // Xóa bài viết khỏi currentPagePosts
    },

    // Bổ sung reducer editPostSuccess
    editPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const updatedPost = action.payload;
      state.postsById[updatedPost._id] = updatedPost; // Cập nhật lại bài viết
    },

    updatePostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const updatedPost = action.payload;
      state.postsById[updatedPost._id] = updatedPost; // Cập nhật bài viết trong state
    },
  },
});

// Action Creator - tạo bài đăng mới
export const createPost =
  ({ content, image }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // upload image to cloudinary
      const imageUrl = await cloudinaryUpload(image);
      const response = await apiService.post("/posts", {
        content,
        image: imageUrl,
      });
      dispatch(slice.actions.createPostSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

// Action Creator - lấy danh sách bài đăng
export const getPosts =
  ({ userId, page, limit = POST_PER_PAGE }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      const response = await apiService.get(`/posts/user/${userId}`, {
        params,
      });
      if (page === 1) dispatch(slice.actions.resetPosts());
      dispatch(slice.actions.getPostSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

// Action Creator - gửi reaction cho bài đăng
export const sendPostReaction =
  ({ postId, emoji }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post(`/reactions`, {
        targetType: "Post",
        targetId: postId,
        emoji: emoji,
      });
      dispatch(
        slice.actions.sendPostReactionSuccess({
          postId,
          reactions: response.data,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

// Action Creator - xóa bài đăng
export const deletePost = (postId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    await apiService.delete(`/posts/${postId}`);
    dispatch(slice.actions.deletePostSuccess(postId)); // Cập nhật state sau khi xóa
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};

// Action Creator - chỉnh sửa bài đăng
export const editPost = (postId, content, image) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    let imageUrl = null;
    if (image) {
      // Nếu có hình ảnh, upload lên Cloudinary
      imageUrl = await cloudinaryUpload(image);
    }
    const response = await apiService.put(`/posts/${postId}`, {
      content,
      image: imageUrl || null, // Nếu không có ảnh, không cần gửi image
    });
    dispatch(slice.actions.editPostSuccess(response.data)); // Cập nhật bài đăng trong state
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};

export const updatePost =
  ({ postId, content }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.put(`/posts/${postId}`, { content });
      dispatch(slice.actions.updatePostSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

export default slice.reducer;
