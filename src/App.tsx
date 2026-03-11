import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // useEffect 안에서 async 함수를 선언하고 바로 실행해줍니다.
    async function getDataFromWorker() {
      const url = "https://blue-resonance-f210.doer1195.workers.dev/api/data";

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`서버 에러 발생: ${response.status}`);
        }

        const result = await response.json();
        console.log("가져온 데이터:", result);
        
        // 받아온 데이터를 state에 저장
        setData(result);
      } catch (error) {
        console.error("데이터 패치 중 오류 발생:", error);
      }
    }

    getDataFromWorker(); 
  }, []); // <-- 빈 배열([])을 넣어야 처음 켜질 때 딱 1번만 실행됩니다.

  // 데이터가 아직 안 왔을 때의 화면
  if (!data) {
    return <>로딩중...</>;
  }

  // 데이터가 왔을 때의 화면 (객체 형태면 JSON.stringify로 문자열로 변환해서 출력해야 합니다)
  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

export default App;