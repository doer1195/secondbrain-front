import { useState, useEffect } from "react";
import "./App.css";

// 1. 데이터 구조 정의 (API가 주는 모양 그대로)
interface Post {
  name: string;
  title: string;
  sha: string;
  size: number;
  download_url: string;
}

interface PostDetail {
  content: string;
  sha: string;
}

function App() {
  // 2. useState에 제네릭(<>)으로 타입 지정
  const [posts, setPosts] = useState<Post[]>([]); 
  const [detail, setDetail] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("https://blue-resonance-f210.doer1195.workers.dev/api/data");
        const result = await response.json();
        setPosts(result);
        setLoading(false);
      } catch (error) {
        console.error("목록 로딩 중 에러:", error);
      }
    }
    fetchPosts();
  }, []);

  // 3. 파라미터 title에 string 타입 명시 (TS7006 해결)
  const handlePostClick = async (title: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://blue-resonance-f210.doer1195.workers.dev/api/data/${title}`);
      const result = await response.json();
      setDetail(result);
      setLoading(false);
    } catch (error) {
      console.error("상세 로딩 중 에러:", error);
      setLoading(false);
    }
  };

  if (loading) return <>로딩 중...</>;

  if (detail) {
    return (
      <div className="detail-view">
        <button onClick={() => setDetail(null)}>← 목록으로 돌아가기</button>
        <hr />
        <div style={{ whiteSpace: "pre-wrap", textAlign: "left", padding: "20px" }}>
          {detail.content}
        </div>
      </div>
    );
  }

  return (
    <div className="list-view">
      <h1>게시글 목록</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((post) => (
          <li 
            key={post.name} // post.name이 존재함을 확신함 (TS2339 해결)
            onClick={() => handlePostClick(post.title)}
            style={{ 
              cursor: "pointer", 
              padding: "15px", 
              borderBottom: "1px solid #eee",
              fontSize: "1.2rem"
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;