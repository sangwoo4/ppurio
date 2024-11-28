import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../../styles/Login.css';
import { useUser } from '../../hooks/UserContext';
import API_BASE_URL from "../../URL_API";

function Login() {
  const { setUserId } = useUser();

  const [isActive, setIsActive] = useState(false);
  const [loginEmail, setEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [EmailValid, setEmailValid] = useState(false);
  const [PasswordValid, setLoginPasswordValid] = useState(false);
  const [notLoginAllow, setNotLoginAllow] = useState(true);

  const loginPasswordInputRef = useRef(null);
  const loginConfirmButtonRef = useRef(null);

  const [businessNum, setBusinessNumber] = useState('');
  const [businessInfo, setBusinessInfo] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const [signUpemail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [owner, setOwner] = useState('');
  const [ownerNum, setOwnerNum] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [field, setField] = useState('');



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
    const fullCode = businessNum.replace(/-/g, ''); // API 전송 시 '-' 제거
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
        alert("인증되었습니다");
      } else {
        setBusinessInfo(null);
        setIsVerified(false);
        alert("등록되지 않은 사업자등록번호입니다.");
      }
    } catch (error) {
      console.log("error", error);
      setBusinessInfo(null);
      setIsVerified(false);
      alert('API 요청 중 오류가 발생했습니다.');
    }
  };

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  useEffect(() => {
    if (EmailValid && PasswordValid) {
      setNotLoginAllow(false);
    } else {
      setNotLoginAllow(true);
    }
  }, [EmailValid, PasswordValid]);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setSignUpEmail(e.target.value);
    const regex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    setEmailValid(regex.test(e.target.value));
  };

  const handlePassword = (e) => {
    setLoginPassword(e.target.value);
    setSignUpPassword(e.target.value);
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;
    setLoginPasswordValid(regex.test(e.target.value));
  };

  const handleLoginEmailKeyDown = (e) => {
    if (e.key === 'Enter') {
      loginPasswordInputRef.current.focus();
    }
  };
  const handleLoginPasswordKeyDown = (e) => {
    if (e.key === 'Enter' && !notLoginAllow) {
      onClickLoginButton();
    }
  };

  // 로그인 api 통신
  const onClickLoginButton = () => {
    fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("백엔드 응답:", res);
        if (res.result && res.data) {
          alert("로그인 되었습니다.");
          setUserId(res.data.userId); // 상태 업데이트
          localStorage.setItem("userId", res.data.userId); // localStorage에 저장
          window.location.href = '/';
        } else {
          alert("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
      })
      .catch((error) => {
        alert("백엔드와 연결을 확인해주세요.");
        console.error("백엔드와의 통신 중 오류 발생:", error);
      });
  };


  //회원가입 api 통신
  const onClickSignUpButton = () => {
    const requestData = {
      email: signUpemail,
      password: signUpPassword,
      businessNum: businessNum.replace(/-/g, ''),
      companyName: companyName,
      owner: owner,
      ownerNum: ownerNum,
      field: field,
    };

    console.log("전송할 데이터:", requestData);

    fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;"
      },
      body: JSON.stringify(requestData),
    })
      .then((res) => res.json())
      .then(res => {
        console.log("백엔드 응답:", res);
        if (res.result) {
          alert("회원가입 되었습니다.");
          window.location.reload();
        } else {
          alert("회원가입에 실패했습니다. 다시 시도해주세요.");
        }
      })
      .catch(error => {
        alert("백엔드와 연결을 확인해주세요.");
        console.error('백엔드와의 통신 중 오류 발생:', error);
      });
  };



  return (
    <div className='login-frame'>
      <div className={`login-container ${isActive ? 'active' : ''}`} id="login-container">
        <div className="form-container sign-in">
          <form>
            <h1>로그인</h1>
            <span>로그인을 위한 정보를 입력해주세요.</span>
            <input
              className="login-input"
              type="email"
              placeholder="이메일"
              value={loginEmail}
              onChange={handleEmail}
              onKeyDown={handleLoginEmailKeyDown}
            />
            <div className="errorMessage">
              {!EmailValid && loginEmail.length > 0 && (
                <div>올바른 이메일을 입력해주세요.</div>
              )}
            </div>

            <input
              className="login-input"
              type="password"
              placeholder="비밀번호"
              value={loginPassword}
              onChange={handlePassword}
              onKeyDown={handleLoginPasswordKeyDown}
              ref={loginPasswordInputRef}
            />
            <div className="errorMessage">
              {!PasswordValid && loginPassword.length > 0 && (
                <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
              )}
            </div>

            <button onClick={onClickLoginButton} disabled={notLoginAllow} type="button">로그인</button>
          </form>
        </div>

        <div className="form-container sign-up">
          <form>
            <h2>회원가입</h2>
            <span>회원가입을 위한 정보를 입력해주세요.</span>
            <div className="businessNumContainer">
              <input
                className="signup-input-bn"
                type="text"
                value={businessNum}
                onChange={handleBusinessNumberChange}
                maxLength="12" // 10자리 숫자 + '-' 기호 두 개
                placeholder="사업자등록번호 (123-45-67890)"
              />
              <span className="businessNumConfirm" onClick={handleCodeCheck}> 확인 </span>
              {isVerified && (
                <span className="businessNumCheck">✔</span>
              )}
            </div>

            <input
              className="signup-input"
              type="email"
              placeholder="이메일"
              value={signUpemail}
              onChange={handleEmail}
            />
            <div className="errorMessage">
              {!EmailValid && signUpemail.length > 0 && (
                <div>올바른 이메일을 입력해주세요.</div>
              )}
            </div>

            <input
              className="signup-input"
              type="password"
              placeholder="비밀번호"
              value={signUpPassword}
              onChange={handlePassword}
            />
            <div className="errorMessage">
              {!PasswordValid && signUpPassword.length > 0 && (
                <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
              )}
            </div>

            <input
              className="signup-input"
              type="password"
              placeholder="비밀번호확인"
              onChange={(e) => {/* 비밀번호 확인 로직 추가 가능 */ }}
            />
            <input
              className="signup-input"
              type="text"
              value={companyName}
              placeholder="회사명"
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
              className="signup-input"
              type="text"
              value={owner}
              placeholder="대표자명"
              onChange={(e) => setOwner(e.target.value)}
            />
            <input
              className="signup-input"
              type="text"
              value={ownerNum}
              placeholder="대표자번호"
              onChange={(e) => setOwnerNum(e.target.value)}
            />
            <input
              className="signup-input"
              type="text"
              value={field}
              placeholder="업종"
              onChange={(e) => setField(e.target.value)}
            />
            <button type="button" onClick={onClickSignUpButton}>회원가입</button>
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-right">
              <h2>아직 계정이 없으신가요?</h2>
              <p>회원가입 후, 이용하실 수 있습니다!</p>
              <button className="hidden" id="register" onClick={handleRegisterClick}>회원가입</button>
            </div>

            <div className="toggle-panel toggle-left">
              <h2>이미 계정이 있나요?</h2>
              <p>계정이 있다면 로그인하세요!</p>
              <button className="hidden" id="login" onClick={handleLoginClick}>로그인</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;






// import React, { useEffect, useState, useRef } from 'react';
// import { Link, useNavigate } from "react-router-dom";
// import '../../styles/Login.css';

// function Login() {
//   const [isActive, setIsActive] = useState(false);
//   const [loginEmail, setEmail] = useState('');
//   const [loginPassword, setLoginPassword] = useState('');

//   const [EmailValid, setEmailValid] = useState(false);
//   const [PasswordValid, setLoginPasswordValid] = useState(false);
//   const [notLoginAllow, setNotLoginAllow] = useState(true);

//   const loginPasswordInputRef = useRef(null);
//   const loginConfirmButtonRef = useRef(null);

//   const [businessNum, setBusinessNumber] = useState('');
//   const [businessInfo, setBusinessInfo] = useState(null);
//   const [isVerified, setIsVerified] = useState(false);

//   const [signUpemail, setSignUpEmail] = useState('');
//   const [signUpPassword, setSignUpPassword] = useState('');
//   const [companyName, setCompanyName] = useState('');
//   const [owner, setOwner] = useState('');
//   const [ownerNum, setOwnerNum] = useState('');
//   const [businessType, setBusinessType] = useState('');
//   const [field, setField] = useState('');



//   const serviceKey = '4u6cu0f2lQ%2BX3Y9XHDyP0%2FCgoAtjs%2FYBSGKVlpDey3LAxgfMaPONswga8xCwhLqwWoz1ReVpiiQuDAUVB72fbw%3D%3D';

//   // 입력 시 '-' 자동 추가
//   const handleBusinessNumberChange = (e) => {
//     const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자 외 문자 제거
//     if (value.length <= 10) {
//       const formattedValue = value
//         .replace(/(\d{3})(\d{2})(\d{0,5})/, '$1-$2-$3')
//         .replace(/-$/, ''); // 끝에 '-'가 붙지 않게 처리
//       setBusinessNumber(formattedValue);
//     }
//   };

//   const handleCodeCheck = async () => {
//     const fullCode = businessNum.replace(/-/g, ''); // API 전송 시 '-' 제거
//     const data = {
//       b_no: [fullCode]
//     };

//     try {
//       const response = await fetch(`https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${serviceKey}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json; charset=UTF-8',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify(data)
//       });

//       const result = await response.json();
//       console.log(result);

//       if (result.match_cnt === 1) { // 숫자형 1로 비교
//         setBusinessInfo(result.data[0]);
//         setIsVerified(true);
//         alert("인증되었습니다");
//       } else {
//         setBusinessInfo(null);
//         setIsVerified(false);
//         alert("등록되지 않은 사업자등록번호입니다.");
//       }
//     } catch (error) {
//       console.log("error", error);
//       setBusinessInfo(null);
//       setIsVerified(false);
//       alert('API 요청 중 오류가 발생했습니다.');
//     }
//   };

//   const handleRegisterClick = () => {
//     setIsActive(true);
//   };

//   const handleLoginClick = () => {
//     setIsActive(false);
//   };

//   useEffect(() => {
//     if (EmailValid && PasswordValid) {
//       setNotLoginAllow(false);
//     } else {
//       setNotLoginAllow(true);
//     }
//   }, [EmailValid, PasswordValid]);

//   const handleEmail = (e) => {
//     setEmail(e.target.value);
//     setSignUpEmail(e.target.value);
//     const regex =
//       /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
//     setEmailValid(regex.test(e.target.value));
//   };

//   const handlePassword = (e) => {
//     setLoginPassword(e.target.value);
//     setSignUpPassword(e.target.value);
//     const regex =
//       /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;
//     setLoginPasswordValid(regex.test(e.target.value));
//   };

//   const handleLoginEmailKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       loginPasswordInputRef.current.focus();
//     }
//   };
//   const handleLoginPasswordKeyDown = (e) => {
//     if (e.key === 'Enter' && !notLoginAllow) {
//       onClickLoginButton();
//     }
//   };

//   //로그인 api 통신
//   const onClickLoginButton = () => {
//     fetch(`http://localhost:8080/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json;"
//       },
//       body: JSON.stringify({
//         email: loginEmail,
//         password: loginPassword,
//       }),
//     })
//       .then((res) => res.json())
//       .then(res => {
//         console.log("백엔드 응답:", res);
//         if (res.data) {
//           alert("로그인 되었습니다.");
//           window.location.href = '/';
//         } else {
//           alert("이메일 또는 비밀번호가 일치하지 않습니다.");
//         }
//       })

//       .catch(error => {
//         alert("백엔드와 연결을 확인해주세요.");
//         console.error('백엔드와의 통신 중 오류 발생:', error);
//       });
//   };

//   //회원가입 api 통신
//   const onClickSignUpButton = () => {
//     const requestData = {
//       email: signUpemail,
//       password: signUpPassword,
//       businessNum: businessNum.replace(/-/g, ''),
//       companyName: companyName,
//       owner: owner,
//       ownerNum: ownerNum,
//       field: field,
//     };

//     console.log("전송할 데이터:", requestData);

//     fetch(`http://localhost:8080/signup`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json;"
//       },
//       body: JSON.stringify(requestData),
//     })
//       .then((res) => res.json())
//       .then(res => {
//         console.log("백엔드 응답:", res);
//         if (res.result) {
//           alert("회원가입 되었습니다.");
//           window.location.reload();
//         } else {
//           alert("회원가입에 실패했습니다. 다시 시도해주세요.");
//         }
//       })
//       .catch(error => {
//         alert("백엔드와 연결을 확인해주세요.");
//         console.error('백엔드와의 통신 중 오류 발생:', error);
//       });
//   };



//   return (
//     <div className='login-frame'>
//       <div className={`login-container ${isActive ? 'active' : ''}`} id="login-container">
//         <div className="form-container sign-in">
//           <form>
//             <h1>로그인</h1>
//             <span>로그인을 위한 정보를 입력해주세요.</span>
//             <input
//               className="login-input"
//               type="email"
//               placeholder="이메일"
//               value={loginEmail}
//               onChange={handleEmail}
//               onKeyDown={handleLoginEmailKeyDown}
//             />
//             <div className="errorMessage">
//               {!EmailValid && loginEmail.length > 0 && (
//                 <div>올바른 이메일을 입력해주세요.</div>
//               )}
//             </div>

//             <input
//               className="login-input"
//               type="password"
//               placeholder="비밀번호"
//               value={loginPassword}
//               onChange={handlePassword}
//               onKeyDown={handleLoginPasswordKeyDown}
//               ref={loginPasswordInputRef}
//             />
//             <div className="errorMessage">
//               {!PasswordValid && loginPassword.length > 0 && (
//                 <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
//               )}
//             </div>

//             <button onClick={onClickLoginButton} disabled={notLoginAllow} type="button">로그인</button>
//           </form>
//         </div>

//         <div className="form-container sign-up">
//           <form>
//             <h1>회원가입</h1>
//             <span>회원가입을 위한 정보를 입력해주세요.</span>
//             <div className="businessNumContainer">
//               <input
//                 className="signup-input-bn"
//                 type="text"
//                 value={businessNum}
//                 onChange={handleBusinessNumberChange}
//                 maxLength="12" // 10자리 숫자 + '-' 기호 두 개
//                 placeholder="사업자등록번호 (123-45-67890)"
//               />
//               <span className="businessNumConfirm" onClick={handleCodeCheck}> 확인 </span>
//               {isVerified && (
//                 <span className="businessNumCheck">✔</span>
//               )}
//             </div>

//             <input
//               className="signup-input"
//               type="email"
//               placeholder="이메일"
//               value={signUpemail}
//               onChange={handleEmail}
//             />
//             <div className="errorMessage">
//               {!EmailValid && signUpemail.length > 0 && (
//                 <div>올바른 이메일을 입력해주세요.</div>
//               )}
//             </div>

//             <input
//               className="signup-input"
//               type="password"
//               placeholder="비밀번호"
//               value={signUpPassword}
//               onChange={handlePassword}
//             />
//             <div className="errorMessage">
//               {!PasswordValid && signUpPassword.length > 0 && (
//                 <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
//               )}
//             </div>

//             <input
//               className="signup-input"
//               type="password"
//               placeholder="비밀번호확인"
//               onChange={(e) => {/* 비밀번호 확인 로직 추가 가능 */ }}
//             />
//             <input
//               className="signup-input"
//               type="text"
//               value={companyName}
//               placeholder="회사명"
//               onChange={(e) => setCompanyName(e.target.value)}
//             />
//             <input
//               className="signup-input"
//               type="text"
//               value={owner}
//               placeholder="대표자명"
//               onChange={(e) => setOwner(e.target.value)}
//             />
//             <input
//               className="signup-input"
//               type="text"
//               value={ownerNum}
//               placeholder="대표자번호"
//               onChange={(e) => setOwnerNum(e.target.value)}
//             />
//             <input
//               className="signup-input"
//               type="text"
//               value={field}
//               placeholder="업종"
//               onChange={(e) => setField(e.target.value)}
//             />
//             <button type="button" onClick={onClickSignUpButton}>회원가입</button>
//           </form>
//         </div>

//         <div className="toggle-container">
//           <div className="toggle">
//             <div className="toggle-panel toggle-right">
//               <h2>아직 계정이 없으신가요?</h2>
//               <p>회원가입 후, 이용하실 수 있습니다!</p>
//               <button className="hidden" id="register" onClick={handleRegisterClick}>회원가입</button>
//             </div>

//             <div className="toggle-panel toggle-left">
//               <h2>이미 계정이 있나요?</h2>
//               <p>계정이 있다면 로그인하세요!</p>
//               <button className="hidden" id="login" onClick={handleLoginClick}>로그인</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
