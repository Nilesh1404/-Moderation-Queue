import { createSlice } from '@reduxjs/toolkit';
import { samplePosts } from '../mock/posts';

const initialState = {
  posts: samplePosts,
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    approvePost(state, action) {
      state.loading = false;
      const post = state.posts.find(p => p.id === action.payload);
      if (post) post.status = 'approved';
    },
    rejectPost(state, action) {
      state.loading = false;
      const post = state.posts.find(p => p.id === action.payload);
      if (post) post.status = 'rejected';
    },
    setPending(state, action) {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) post.status = 'pending';
    },
    // Add more reducers for batch, loading, error, etc.
  },
});

export const { approvePost, rejectPost, setLoading, setError, setPending } = postsSlice.actions;
export default postsSlice.reducer; 