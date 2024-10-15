// CommentForm.js
import React, { useState } from 'react';

function CommentForm({ propertyId }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ propertyId, content }),
    }).then(() => {
      // Refresh comments or handle success
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default CommentForm;
