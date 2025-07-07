import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { approvePost, rejectPost, setPending } from '../features/postsSlice.js';
import { HiUser, HiClock, HiFlag, HiDocumentText, HiCheckCircle, HiXCircle, HiRefresh } from 'react-icons/hi';

const statusBg = {
  pending: 'bg-gradient-to-r from-sky-50 to-blue-100',
  approved: 'bg-gradient-to-r from-emerald-50 to-green-100',
  rejected: 'bg-gradient-to-r from-rose-50 to-red-100',
};

const PostModal = ({ post, posts = [], index, setIndex, onClose, onAction }) => {
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Trap focus
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    // Focus the close button on open
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  // Keyboard shortcuts in modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key.toLowerCase() === 'a' && post.status === 'pending') {
        dispatch(approvePost(post.id));
        if (onAction) onAction('Post approved', 'success', post);
        onClose();
        e.preventDefault();
      } else if (e.key.toLowerCase() === 'r' && post.status === 'pending') {
        dispatch(rejectPost(post.id));
        if (onAction) onAction('Post rejected', 'error', post);
        onClose();
        e.preventDefault();
      } else if (e.key === 'Escape') {
        onClose();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, post, onAction, onClose]);

  if (!post) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in"
    >
      <div
        ref={modalRef}
        className={`w-full max-w-4xl min-h-[60vh] sm:min-h-[70vh] mx-2 relative rounded-3xl shadow-2xl border-l-8 p-0 bg-white ${statusBg[post.status] || 'bg-white'} border-sky-200 transition-all duration-500 animate-fade-in-up`}
        tabIndex={-1}
      >
        {/* Header with navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-t-3xl bg-gradient-to-r from-sky-500 via-blue-400 to-emerald-400">
          <button
            onClick={() => setIndex(index - 1)}
            disabled={index === 0}
            className="px-3 py-1 rounded-full bg-white/80 text-sky-700 font-bold shadow hover:bg-sky-100 transition disabled:opacity-50"
            aria-label="Previous post"
          >
            &larr;
          </button>
          <h2 id="modal-title" className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-sm text-center flex-1">
            {post.title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIndex(index + 1)}
              disabled={index === posts.length - 1}
              className="px-3 py-1 rounded-full bg-white/80 text-sky-700 font-bold shadow hover:bg-sky-100 transition disabled:opacity-50"
              aria-label="Next post"
            >
              &rarr;
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="ml-2 px-2 py-1 rounded-full bg-white/80 text-gray-400 hover:text-sky-600 text-2xl font-bold focus:outline-none"
            >
              ×
            </button>
          </div>
        </div>
        {/* Metadata section */}
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 border-b border-gray-100 bg-white rounded-b-none">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <HiUser className="text-sky-500 w-5 h-5" />
            <span className="font-semibold">{post.author.username}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <HiFlag className="text-rose-500 w-5 h-5" />
            <span className="font-semibold">{post.reportedReason}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <HiClock className="text-gray-400 w-5 h-5" />
            <span>{new Date(post.reportedAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <HiDocumentText className="text-emerald-500 w-5 h-5" />
            <span>Reports: <span className="font-semibold">{post.reportCount || 1}</span></span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            {post.status === 'approved' && <HiCheckCircle className="text-emerald-500 w-5 h-5" />}
            {post.status === 'rejected' && <HiXCircle className="text-rose-500 w-5 h-5" />}
            {post.status === 'pending' && <HiRefresh className="text-sky-500 w-5 h-5 animate-spin-slow" />}
            <span className="capitalize font-semibold text-xs px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 ml-1">{post.status}</span>
          </div>
        </div>
        {/* Image preview */}
        {post.image && (
          <div className="flex justify-center items-center bg-gray-50 border-b border-gray-100 px-6 py-4">
            <img src={post.image} alt="Post visual" className="max-h-72 rounded-xl border border-gray-200 shadow" />
          </div>
        )}
        {/* Content section */}
        <div className="px-8 py-8 bg-white min-h-[200px]">
          <div className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
            <HiDocumentText className="w-5 h-5 text-sky-400" />
            Content
          </div>
          <div className="bg-white/80 p-4 rounded-xl text-gray-800 whitespace-pre-line border border-gray-100 shadow-inner text-base">
            {post.content}
          </div>
        </div>
        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-2 mt-6">
          {post.status === 'pending' && (
            <>
              <button
                onClick={() => { dispatch(approvePost(post.id)); if (onAction) onAction('Post approved', 'success', post); onClose(); }}
                className="w-full sm:w-auto px-4 py-2 rounded-full bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600 transition"
              >
                Approve
              </button>
              <button
                onClick={() => { dispatch(rejectPost(post.id)); if (onAction) onAction('Post rejected', 'error', post); onClose(); }}
                className="w-full sm:w-auto px-4 py-2 rounded-full bg-rose-500 text-white font-semibold shadow hover:bg-rose-600 transition"
              >
                Reject
              </button>
            </>
          )}
          {(post.status === 'approved' || post.status === 'rejected') && (
            <button
              onClick={() => { dispatch(setPending(post.id)); if (onAction) onAction('Post set to pending', 'info', post); onClose(); }}
              className="w-full sm:w-auto px-4 py-2 rounded-full bg-sky-500 text-white font-semibold shadow hover:bg-sky-600 transition"
            >
              Set Pending
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-full sm:w-auto px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 shadow transition"
          >
            Close
          </button>
        </div>
        {/* Shortcuts bar in modal */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/90 border border-gray-200 rounded-full px-6 py-2 shadow flex gap-4 items-center text-xs font-semibold text-gray-700 backdrop-blur hidden lg:flex">
          <span className="text-sky-600">Shortcuts:</span>
          <span><kbd className="px-2 py-1 bg-gray-100 rounded">A</kbd> Approve</span>
          <span><kbd className="px-2 py-1 bg-gray-100 rounded">R</kbd> Reject</span>
          <span><kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
};

export default PostModal; 