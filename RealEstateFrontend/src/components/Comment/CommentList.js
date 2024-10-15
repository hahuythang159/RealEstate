// CommentList.js
import React, { useEffect, useState } from 'react';

function CommentList({ propertyId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`/api/comments?propertyId=${propertyId}`)
      .then((response) => response.json())
      .then((data) => setComments(data));
  }, [propertyId]);

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <small>{new Date(comment.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
