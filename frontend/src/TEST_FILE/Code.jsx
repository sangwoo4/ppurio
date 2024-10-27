import React, { useState } from 'react';

const Code = () => {
  const [searchParams, setSearchParams] = useState({
    indstrytyClsfcCd: '',
    indstrytyNm: '',
    indstrytyCd: '',
    inqryBgnDt: '',
    inqryEndDt: '',
    type: 'json',
    pageNo: 1,
    numOfRows: 10,
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const serviceKey = '4u6cu0f2lQ%2BX3Y9XHDyP0%2FCgoAtjs%2FYBSGKVlpDey3LAxgfMaPONswga8xCwhLqwWoz1ReVpiiQuDAUVB72fbw%3D%3D'; // 공공데이터포털에서 발급받은 서비스키를 넣어주세요
    const queryParams = new URLSearchParams({
      ...searchParams,
      ServiceKey: serviceKey,
    }).toString();

    try {
      const response = await fetch(
        `http://apis.data.go.kr/1230000/IndstrytyBaseLawrgltInfoService02/getIndstrytyBaseLawrgltInfoList02?${queryParams}`
      );
      const data = await response.json();

      if (data.resultCode === '00') {
        setResults(data.items || []);
      } else {
        setError(data.resultMsg || 'Error fetching data');
      }
    } catch (error) {
      setError('Failed to fetch data');
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div>
      <h1>업종 정보 조회</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>업종분류코드: </label>
          <input
            type="text"
            name="indstrytyClsfcCd"
            value={searchParams.indstrytyClsfcCd}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>업종명: </label>
          <input
            type="text"
            name="indstrytyNm"
            value={searchParams.indstrytyNm}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>업종코드: </label>
          <input
            type="text"
            name="indstrytyCd"
            value={searchParams.indstrytyCd}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>조회시작일시: </label>
          <input
            type="text"
            name="inqryBgnDt"
            value={searchParams.inqryBgnDt}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>조회종료일시: </label>
          <input
            type="text"
            name="inqryEndDt"
            value={searchParams.inqryEndDt}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="submit">검색</button>
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>업종분류코드</th>
              <th>업종분류명</th>
              <th>업종코드</th>
              <th>업종명</th>
              <th>근거법령명</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr key={index}>
                <td>{item.indstrytyClsfcCd}</td>
                <td>{item.indstrytyClsfcNm}</td>
                <td>{item.indstrytyCd}</td>
                <td>{item.indstrytyNm}</td>
                <td>{item.baseLawordNm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Code;
