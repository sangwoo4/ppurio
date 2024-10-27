import React, { useState } from 'react';

const BusinessNumberCheck = () => {
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [code3, setCode3] = useState('');
  const [businessInfo, setBusinessInfo] = useState(null); // 사업자 정보 상태 추가

  // 인증키를 변수로 선언
  const serviceKey = '4u6cu0f2lQ%2BX3Y9XHDyP0%2FCgoAtjs%2FYBSGKVlpDey3LAxgfMaPONswga8xCwhLqwWoz1ReVpiiQuDAUVB72fbw%3D%3D';

  const handleCodeCheck = async () => {
    const fullCode = `${code1}${code2}${code3}`;
    const data = {
      b_no: [fullCode] // API에 전송할 데이터 포맷
    };

    try {
      const response = await fetch(`https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${serviceKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log(result);

      if (result.match_cnt === "1") {
        // 성공
        console.log("success");
        setBusinessInfo(result.data[0]); // 사업자 정보 상태 업데이트
      } else {
        // 실패
        console.log("fail");
        alert(result.data[0]?.tax_type || '유효하지 않은 사업자 등록 번호입니다.');
        setBusinessInfo(null); // 실패 시 사업자 정보 초기화
      }
    } catch (error) {
      console.log("error", error);
      alert('API 요청 중 오류가 발생했습니다.');
      setBusinessInfo(null); // 오류 발생 시 사업자 정보 초기화
    }
  };

  return (
    <div>
      <form>
        <table className="tb_board_1">
          <tbody>
            <tr>
              <th scope="row">사업자등록번호</th>
              <td className="left_5">
                <div>
                  <input
                    type="text"
                    name="code1"
                    value={code1}
                    onChange={(e) => setCode1(e.target.value)}
                    size="3"
                    maxLength="3"
                    style={{ imeMode: 'disabled' }}
                    placeholder="사업자등록번호1"
                  />
                  -
                  <input
                    type="text"
                    name="code2"
                    value={code2}
                    onChange={(e) => setCode2(e.target.value)}
                    size="2"
                    maxLength="2"
                    style={{ imeMode: 'disabled' }}
                    placeholder="사업자등록번호2"
                  />
                  -
                  <input
                    type="text"
                    name="code3"
                    value={code3}
                    onChange={(e) => setCode3(e.target.value)}
                    size="5"
                    maxLength="5"
                    style={{ imeMode: 'disabled' }}
                    placeholder="사업자등록번호3"
                  />
                </div>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={handleCodeCheck}
                >
                  확인
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      {businessInfo && (
        <div>
          <h3>사업자 정보</h3>
          <p>업종명: {businessInfo.tax_type}</p>
          <p>대표자명: {businessInfo.b_no}</p> {/* 대표자명 필드는 API 응답에 없지만 예시로 추가 */}
          <p>회사명: {businessInfo.b_stt}</p> {/* 회사명도 API 응답에 없지만 예시로 추가 */}
        </div>
      )}
    </div>
  );
};

export default BusinessNumberCheck;
