import { useState } from 'react';
import { api } from '../api';

export default function PostForm({ user, onCreated }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await api('/posts', { method: 'POST', body: { content } });
      onCreated(data.post);
      setContent('');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <textarea
        placeholder={`Quoi de neuf, ${user.firstName} ?`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={!content.trim()}>
        Publier
      </button>
    </form>
  );
}
