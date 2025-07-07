import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { approvePost, rejectPost, setPending } from '../features/postsSlice.js';
import ConfirmDialog from './ConfirmDialog.js';

const statusColors = {
  pending: 'border-sky-500',
  approved: 'border-emerald-500',
  rejected: 'border-rose-500',
};

const statusBg = {
  pending: 'bg-gradient-to-r from-sky-50 to-blue-100',
  approved: 'bg-gradient-to-r from-emerald-50 to-green-100',
  rejected: 'bg-gradient-to-r from-rose-50 to-red-100',
};

const PostItem = ({ post, onView, selected, onSelect, checkboxDisabled, onAction, focused, onFocus }) => {
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleApprove = () => {
    dispatch(approvePost(post.id));
    if (onAction) onAction('Post approved', 'success', post);
  };

  const handleReject = () => {
    setShowConfirm(true);
  };

  const handleConfirmReject = () => {
    dispatch(rejectPost(post.id));
    setShowConfirm(false);
    if (onAction) onAction('Post rejected', 'error', post);
  };

  const handleCancelReject = () => {
    setShowConfirm(false);
  };

  const handleView = () => {
    if (onView) onView(post);
  };

  const handleSetPending = () => {
    dispatch(setPending(post.id));
    if (onAction) onAction('Post set to pending', 'info', post);
  };

  return (
    <div
      className={`flex flex-col md:flex-row items-start md:items-center gap-4 border-l-8 ${statusColors[post.status]} ${statusBg[post.status]} border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-lg group hover:shadow-2xl transition-shadow cursor-pointer ${focused ? 'ring-4 ring-sky-400 ring-opacity-60 z-10' : ''} animate-fade-in-up`}
      style={{ animationDuration: '0.5s' }}
      tabIndex={0}
      onFocus={onFocus}
      aria-selected={focused}
    > 
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        disabled={checkboxDisabled}
        className="accent-sky-500 mt-1 w-5 h-5 md:mt-0 rounded-full border-2 border-sky-300 shadow-sm focus:ring-2 focus:ring-sky-400"
      />
      <div className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
          <strong className="text-base sm:text-xl cursor-pointer hover:underline text-sky-900 font-semibold tracking-tight" onClick={handleView}>{post.title}</strong>
          <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm rounded-full bg-sky-100 text-sky-700 font-semibold ml-0 sm:ml-2 shadow border border-sky-200">{post.reportedReason}</span>
          <button className="ml-0 sm:ml-2 px-2 sm:px-3 py-1 text-xs rounded-full bg-sky-600 text-white font-semibold shadow hover:bg-sky-700 transition" onClick={handleView}>View</button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-700 text-xs sm:text-sm">
          <span>By: <span className="font-semibold text-gray-900">{post.author.username}</span></span>
          <span className="hidden sm:inline">|</span>
          <span className="text-gray-400 text-xs">Reported At: {new Date(post.reportedAt).toLocaleString()}</span>
        </div>
        {focused && (
          <div className="mt-2 flex gap-2 text-xs text-sky-600 font-semibold items-center">
            <kbd className="px-2 py-1 bg-gray-100 rounded">A</kbd> Approve
            <kbd className="px-2 py-1 bg-gray-100 rounded">R</kbd> Reject
            <kbd className="px-2 py-1 bg-gray-100 rounded">Space</kbd> Preview
          </div>
        )}
      </div>
      <div className="flex flex-col items-stretch sm:items-end gap-2 min-w-[140px] transition-all duration-300">
        <div className="flex flex-col sm:flex-col w-full gap-2 sm:gap-2 mt-2 sm:mt-0">
          <button
            onClick={handleApprove}
            disabled={post.status !== 'pending'}
            className="px-3 sm:px-4 py-1 rounded-full bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600 transition disabled:opacity-50 w-full"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            disabled={post.status !== 'pending'}
            className="px-3 sm:px-4 py-1 rounded-full bg-rose-500 text-white font-semibold shadow hover:bg-rose-600 transition disabled:opacity-50 w-full"
          >
            Reject
          </button>
          {post.status !== 'pending' && (
            <button
              onClick={handleSetPending}
              className="px-3 sm:px-4 py-1 rounded-full bg-yellow-400 text-white font-semibold shadow hover:bg-yellow-500 transition w-full"
            >
              Set Pending
            </button>
          )}
          <span className={`mt-1 text-xs font-bold uppercase tracking-wide ${post.status === 'approved' ? 'text-emerald-600' : post.status === 'rejected' ? 'text-rose-600' : 'text-sky-500'}`}>
            {post.status}
          </span>
        </div>
      </div>
      <ConfirmDialog
        open={showConfirm}
        message="Are you sure you want to reject this post?"
        onConfirm={handleConfirmReject}
        onCancel={handleCancelReject}
      />
    </div>
  );
};

export default PostItem; 