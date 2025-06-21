import { useState } from 'react'

interface Post {
  id: string
  imageUrl: string
  caption: string
  username: string
  likes: number
  comments: Comment[]
  createdAt: Date
}

interface Comment {
  id: string
  username: string
  text: string
  createdAt: Date
}

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [newCaption, setNewCaption] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handlePost = () => {
    if (selectedImage && newCaption.trim()) {
      const newPost: Post = {
        id: Date.now().toString(),
        imageUrl: previewUrl!,
        caption: newCaption,
        username: 'あなた',
        likes: 0,
        comments: [],
        createdAt: new Date()
      }
      setPosts([newPost, ...posts])
      setNewCaption('')
      setSelectedImage(null)
      setPreviewUrl(null)
    }
  }

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ))
  }

  const handleComment = (postId: string, commentText: string) => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        username: 'あなた',
        text: commentText,
        createdAt: new Date()
      }
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ))
    }
  }

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '1rem'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>📸 画像共有SNS</h1>
      
      {/* 投稿フォーム */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '1.5rem', 
        borderRadius: '12px',
        marginBottom: '2rem'
      }}>
        <h3>新しい投稿</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ marginBottom: '1rem' }}
          />
          {previewUrl && (
            <img 
              src={previewUrl} 
              alt="プレビュー" 
              style={{ 
                width: '100%', 
                maxHeight: '300px', 
                objectFit: 'cover', 
                borderRadius: '8px' 
              }} 
            />
          )}
        </div>
        
        <textarea
          value={newCaption}
          onChange={(e) => setNewCaption(e.target.value)}
          placeholder="キャプションを入力..."
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            resize: 'vertical',
            fontSize: '14px'
          }}
        />
        
        <button
          onClick={handlePost}
          disabled={!selectedImage || !newCaption.trim()}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: selectedImage && newCaption.trim() ? '#007acc' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: selectedImage && newCaption.trim() ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          投稿する
        </button>
      </div>

      {/* 投稿一覧 */}
      <div>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>
            まだ投稿がありません。最初の投稿をしてみましょう！
          </p>
        ) : (
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onLike={handleLike}
              onComment={handleComment}
            />
          ))
        )}
      </div>
    </div>
  )
}

function PostCard({ 
  post, 
  onLike, 
  onComment 
}: { 
  post: Post
  onLike: (postId: string) => void
  onComment: (postId: string, comment: string) => void
}) {
  const [commentText, setCommentText] = useState('')

  const handleAddComment = () => {
    onComment(post.id, commentText)
    setCommentText('')
  }

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '12px',
      marginBottom: '1.5rem',
      overflow: 'hidden'
    }}>
      {/* ヘッダー */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
          {post.username}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          {post.createdAt.toLocaleString()}
        </div>
      </div>

      {/* 画像 */}
      <img 
        src={post.imageUrl} 
        alt={post.caption}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />

      {/* アクション */}
      <div style={{ padding: '1rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <button
            onClick={() => onLike(post.id)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              marginRight: '1rem'
            }}
          >
            ❤️ {post.likes}
          </button>
        </div>

        <div style={{ marginBottom: '1rem', fontSize: '14px' }}>
          <strong>{post.username}</strong> {post.caption}
        </div>

        {/* コメント */}
        {post.comments.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            {post.comments.map(comment => (
              <div key={comment.id} style={{ fontSize: '14px', marginBottom: '0.5rem' }}>
                <strong>{comment.username}</strong> {comment.text}
              </div>
            ))}
          </div>
        )}

        {/* コメント入力 */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="コメントを入力..."
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '20px',
              fontSize: '14px'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddComment()
              }
            }}
          />
          <button
            onClick={handleAddComment}
            disabled={!commentText.trim()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: commentText.trim() ? '#007acc' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: commentText.trim() ? 'pointer' : 'not-allowed',
              fontSize: '12px'
            }}
          >
            投稿
          </button>
        </div>
      </div>
    </div>
  )
}

export default App