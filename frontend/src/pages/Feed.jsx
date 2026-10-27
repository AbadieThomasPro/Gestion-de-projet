import { useEffect, useState } from 'react';
import { api } from '../api';
import PostForm from '../components/PostForm';
import Post from '../components/Post';

export default function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    api(`/posts?page=${page}`).then((data) => {
      setPosts((prev) => (page === 1 ? data.posts : [...prev, ...data.posts]));
      setHasMore(data.hasMore);
    });
  }, [page]);

  return (
    <>
      <PostForm user={user} onCreated={(post) => setPosts([post, ...posts])} />

      {posts.length === 0 && <p className="center">Aucune publication pour le moment.</p>}

      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          user={user}
          onDeleted={(id) => setPosts(posts.filter((p) => p.id !== id))}
        />
      ))}

      {hasMore && (
        <button className="btn-light load-more" onClick={() => setPage(page + 1)}>
          Voir plus
        </button>
      )}
    </>
  );
}
