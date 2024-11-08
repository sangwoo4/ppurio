import React, { useState } from 'react';

const TestFile = () => {
  const [businessNumber, setBusinessNumber] = useState('');
  const [businessInfo, setBusinessInfo] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const serviceKey = '4u6cu0f2lQ%2BX3Y9XHDyP0%2FCgoAtjs%2FYBSGKVlpDey3LAxgfMaPONswga8xCwhLqwWoz1ReVpiiQuDAUVB72fbw%3D%3D';

  // 입력 시 '-' 자동 추가
  const handleBusinessNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자 외 문자 제거
    if (value.length <= 10) {
      const formattedValue = value
        .replace(/(\d{3})(\d{2})(\d{0,5})/, '$1-$2-$3')
        .replace(/-$/, ''); // 끝에 '-'가 붙지 않게 처리
      setBusinessNumber(formattedValue);
    }
  };

  const handleCodeCheck = async () => {
    const fullCode = businessNumber.replace(/-/g, ''); // API 전송 시 '-' 제거
    const data = {
      b_no: [fullCode]
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

      if (result.match_cnt === 1) { // 숫자형 1로 비교
        setBusinessInfo(result.data[0]);
        setIsVerified(true);
        setVerificationMessage("인증되었습니다");
      } else {
        setBusinessInfo(null);
        setIsVerified(false);
        setVerificationMessage("등록되지 않은 사업자등록번호입니다.");
      }
    } catch (error) {
      console.log("error", error);
      setBusinessInfo(null);
      setIsVerified(false);
      setVerificationMessage('API 요청 중 오류가 발생했습니다.');
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
                <input
                  type="text"
                  value={businessNumber}
                  onChange={handleBusinessNumberChange}
                  maxLength="12" // 10자리 숫자 + '-' 기호 두 개
                  placeholder="사업자등록번호 (123-45-67890)"
                />
                <span
                  style={{ cursor: 'pointer', marginLeft: '10px' }}
                  onClick={handleCodeCheck}
                >
                  확인
                </span>
                {isVerified && (
                  <span style={{ color: 'green', marginLeft: '10px' }}>✔</span>
                )}
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <p style={{ color: isVerified ? 'green' : 'red' }}>
                  {verificationMessage}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      {businessInfo && (
        <div>
          <h3>사업자 정보</h3>
          <p>업종명: {businessInfo.tax_type}</p>
          <p>사업자번호: {businessInfo.b_no}</p>
          <p>상태: {businessInfo.b_stt}</p>
        </div>
      )}
    </div>
  );
};

export default TestFile;
