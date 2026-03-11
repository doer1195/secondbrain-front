import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]); // 전체 글 목록
  const [detail, setDetail] = useState(null); // 선택한 글의 상세 내용
  const [loading, setLoading] = useState(true);

  // 1. 처음 접속 시 글 목록(/api/data) 가져오기
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

  // 2. 제목 클릭 시 상세 내용(/api/data/:filename) 가져오기
  const handlePostClick = async (title) => {
    setLoading(true);
    try {
      // API 설계상 title(파일명)을 넘겨서 상세 데이터를 가져옵/니다.
      const response = await fetch(`https://blue-resonance-f210.doer1195.workers.dev/api/data/${title}`);
      const result = await response.json();
      setDetail(result); // 상세 데이터(content, sha 등) 저장
      setLoading(false);
    } catch (error) {
      console.error("상세 로딩 중 에러:", error);
      setLoading(false);
    }
  };

  if (loading) return <>로딩 중...</>;

  // 3. 상세 화면 (detail 데이터가 있을 때)
  if (detail) {
    return (
      <div className="detail-view">
        <button onClick={() => setDetail(null)}>← 목록으로 돌아가기</button>
        <hr />
        {/* 마크다운 원문을 그대로 보여주거나 라이브러리를 써서 렌더링 가능 */}
        <div style={{ whiteSpace: "pre-wrap", textAlign: "left", padding: "20px" }}>
          {detail.content}
        </div>
      </div>
    );
  }

  // 4. 목록 화면 (detail 데이터가 없을 때 기본값)
  return (
    <div className="list-view">
      <h1>게시글 목록</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((post) => (
          <li 
            key={post.name} 
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