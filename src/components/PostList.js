import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostItem from './PostItem.js';
import PostModal from './PostModal.js';
import StatusTabs from './StatusTabs.js';
import Loader from './Loader.js';
import EmptyState from './EmptyState.js';
import Snackbar from './Snackbar.js';
import { approvePost, rejectPost, setLoading, setPending } from '../features/postsSlice.js';

const PostList = () => {
  const posts = useSelector(state => state.posts.posts);
  const loading = useSelector(state => state.posts.loading);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', variant: 'info', undo: null });
  const [undoData, setUndoData] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);
  const [modalPostIndex, setModalPostIndex] = useState(null);
  const [loadedCount, setLoadedCount] = useState(10);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const listEndRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [status, setStatus] = useState('pending');

  const filteredPosts = posts.filter(post => post.status === status);

  useEffect(() => {
    setLoadedCount(10);
  }, [status]);

  const handleView = useCallback((post) => {
    const idx = filteredPosts.findIndex(p => p.id === post.id);
    setModalPostIndex(idx);
  }, [filteredPosts]);

  const handleCloseModal = () => {
    setModalPostIndex(null);
  };

  const handleSelect = (postId) => {
    setSelected(selected =>
      selected.includes(postId)
        ? selected.filter(id => id !== postId)
        : [...selected, postId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(filteredPosts.map(p => p.id));
    } else {
      setSelected([]);
    }
  };

  const handleBatchApprove = () => {
    dispatch(setLoading(true));
    setTimeout(() => {
      const prev = posts.filter(p => selected.includes(p.id)).map(p => ({ ...p }));
      selected.forEach(id => dispatch(approvePost(id)));
      dispatch(setLoading(false));
      setUndoData({ posts: prev, prev: prev.map(p => p.status), type: 'success' });
      setSnackbar({ open: true, message: 'Approved selected posts.', variant: 'success' });
      if (undoTimeout) clearTimeout(undoTimeout);
      setUndoTimeout(setTimeout(() => setUndoData(null), 3500));
      setSelected([]);
    }, 500);
  };

  const handleBatchReject = () => {
    dispatch(setLoading(true));
    setTimeout(() => {
      const prev = posts.filter(p => selected.includes(p.id)).map(p => ({ ...p }));
      selected.forEach(id => dispatch(rejectPost(id)));
      dispatch(setLoading(false));
      setUndoData({ posts: prev, prev: prev.map(p => p.status), type: 'error' });
      setSnackbar({ open: true, message: 'Rejected selected posts.', variant: 'error' });
      if (undoTimeout) clearTimeout(undoTimeout);
      setUndoTimeout(setTimeout(() => setUndoData(null), 3500));
      setSelected([]);
    }, 500);
  };

  const handleBatchSetPending = () => {
    dispatch(setLoading(true));
    setTimeout(() => {
      const prev = posts.filter(p => selected.includes(p.id)).map(p => ({ ...p }));
      selected.forEach(id => dispatch(setPending(id)));
      dispatch(setLoading(false));
      setUndoData({ posts: prev, prev: prev.map(p => p.status), type: 'info' });
      setSnackbar({ open: true, message: 'Set selected posts to pending.', variant: 'info' });
      if (undoTimeout) clearTimeout(undoTimeout);
      setUndoTimeout(setTimeout(() => setUndoData(null), 3500));
      setSelected([]);
    }, 500);
  };

  const handleUndo = () => {
    if (undoData && undoData.posts) {
      undoData.posts.forEach((post, i) => {
        if (undoData.prev[i] === 'pending') dispatch(setPending(post.id));
        if (undoData.prev[i] === 'approved') dispatch(approvePost(post.id));
        if (undoData.prev[i] === 'rejected') dispatch(rejectPost(post.id));
      });
      setSnackbar({ open: true, message: 'Action undone!', variant: 'success' });
      setUndoData(null);
      if (undoTimeout) clearTimeout(undoTimeout);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '', variant: 'info', undo: null });
    setUndoData(null);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setSelected([]);
  };

  const counts = posts.reduce((acc, post) => {
    acc[post.status] = (acc[post.status] || 0) + 1;
    return acc;
  }, { pending: 0, approved: 0, rejected: 0 });

  const allTabIds = filteredPosts.map(p => p.id);
  const allSelected = allTabIds.length > 0 && allTabIds.every(id => selected.includes(id));

  const paginatedPosts = filteredPosts.slice(0, loadedCount);

  const handleLoadMore = useCallback(() => {
    if (infiniteLoading) return;
    setInfiniteLoading(true);
    setTimeout(() => {
      setLoadedCount(count => Math.min(count + 10, filteredPosts.length));
      setInfiniteLoading(false);
    }, 500); // Simulate async fetch
  }, [filteredPosts.length, infiniteLoading]);

  useEffect(() => {
    if (!listEndRef.current) return;
    const observer = new window.IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && loadedCount < filteredPosts.length) {
          handleLoadMore();
        }
      },
      { threshold: 1 }
    );
    observer.observe(listEndRef.current);
    return () => observer.disconnect();
  }, [handleLoadMore, loadedCount, filteredPosts.length]);

  const handleAction = useCallback((message, variant = 'info', post) => {
    setSnackbar({ open: true, message, variant });
    if (post) {
      setUndoData({ posts: [post], prev: [post.status], type: variant });
      if (undoTimeout) clearTimeout(undoTimeout);
      setUndoTimeout(setTimeout(() => setUndoData(null), 3500));
    }
  }, [undoTimeout]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (modalPostIndex !== null) return; // Modal handles its own shortcuts
      if (paginatedPosts.length === 0) return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key === 'ArrowDown') {
        setFocusedIndex(i => Math.min(i + 1, paginatedPosts.length - 1));
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        setFocusedIndex(i => Math.max(i - 1, 0));
        e.preventDefault();
      } else if (e.key === ' ') {
        handleView(paginatedPosts[focusedIndex]);
        e.preventDefault();
      } else if (e.key.toLowerCase() === 'a') {
        const post = paginatedPosts[focusedIndex];
        if (post.status === 'pending') {
          dispatch(approvePost(post.id));
          handleAction('Post approved', 'success', post);
        }
        e.preventDefault();
      } else if (e.key.toLowerCase() === 'r') {
        const post = paginatedPosts[focusedIndex];
        if (post.status === 'pending') {
          dispatch(rejectPost(post.id));
          handleAction('Post rejected', 'error', post);
        }
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setSelected([]);
        setFocusedIndex(0);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginatedPosts, focusedIndex, modalPostIndex, dispatch, handleAction, handleView]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <StatusTabs current={status} counts={counts} onChange={handleStatusChange} />
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-4 gap-2 sm:gap-4 bg-white rounded-lg shadow px-2 sm:px-4 py-2 sm:py-3">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={handleSelectAll}
          disabled={allTabIds.length === 0 && filteredPosts.length === 0}
          className="accent-sky-500 w-5 h-5 rounded-full border-2 border-sky-300 shadow-sm focus:ring-2 focus:ring-sky-400"
        />
        <span className="ml-2 font-semibold text-sky-700">Select All</span>
        <span className="ml-4 text-gray-600">Selected: {selected.length}</span>
        {status === 'pending' && (
          <>
            <button
              onClick={handleBatchApprove}
              disabled={selected.length === 0 || loading}
              className="ml-4 px-4 py-1 rounded-full bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600 transition disabled:opacity-50"
            >
              Approve Selected
            </button>
            <button
              onClick={handleBatchReject}
              disabled={selected.length === 0 || loading}
              className="ml-2 px-4 py-1 rounded-full bg-rose-500 text-white font-semibold shadow hover:bg-rose-600 transition disabled:opacity-50"
            >
              Reject Selected
            </button>
          </>
        )}
        {(status === 'approved' || status === 'rejected') && (
          <button
            onClick={handleBatchSetPending}
            disabled={selected.length === 0 || loading}
            className="ml-4 px-4 py-1 rounded-full bg-sky-500 text-white font-semibold shadow hover:bg-sky-600 transition disabled:opacity-50"
          >
            Set Pending
          </button>
        )}
      </div>
      {loading ? (
        <Loader />
      ) : paginatedPosts && paginatedPosts.length > 0 ? (
        <div className="flex flex-col gap-4 sm:gap-6">
          {paginatedPosts.map((post, i) => (
            <PostItem
              key={post.id}
              post={post}
              onView={handleView}
              selected={selected.includes(post.id)}
              onSelect={() => handleSelect(post.id)}
              checkboxDisabled={loading}
              onAction={handleAction}
              focused={i === focusedIndex}
              onFocus={() => setFocusedIndex(i)}
            />
          ))}
          <div ref={listEndRef} />
          {infiniteLoading && <Loader />}
          {loadedCount < filteredPosts.length && !infiniteLoading && (
            <button
              onClick={handleLoadMore}
              className="mx-auto mt-4 px-6 py-2 rounded-full bg-sky-500 text-white font-semibold shadow hover:bg-sky-600 transition"
            >
              Load More
            </button>
          )}
        </div>
      ) : (
        <EmptyState message="No posts to review." />
      )}
      {modalPostIndex !== null && (
        <PostModal
          post={paginatedPosts[modalPostIndex]}
          posts={paginatedPosts}
          index={modalPostIndex}
          setIndex={setModalPostIndex}
          onClose={handleCloseModal}
          onAction={handleAction}
        />
      )}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={handleSnackbarClose}
        variant={snackbar.variant}
        onUndo={undoData ? handleUndo : undefined}
      />
      {/* Shortcuts bar */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 bg-white/90 border border-gray-200 rounded-full px-6 py-2 shadow flex gap-4 items-center text-xs font-semibold text-gray-700 backdrop-blur hidden lg:flex">
        <span className="text-sky-600">Shortcuts:</span>
        <span><kbd className="px-2 py-1 bg-gray-100 rounded">A</kbd> Approve</span>
        <span><kbd className="px-2 py-1 bg-gray-100 rounded">R</kbd> Reject</span>
        <span><kbd className="px-2 py-1 bg-gray-100 rounded">Space</kbd> Preview</span>
        <span><kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> Deselect/Close</span>
        <span><kbd className="px-2 py-1 bg-gray-100 rounded">↑↓</kbd> Navigate</span>
      </div>
    </div>
  );
};

export default PostList; 