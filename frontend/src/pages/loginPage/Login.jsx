import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../../styles/Login.css';

function Login() {
  const [isActive, setIsActive] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [LoginPassword, setLoginPassword] = useState('');

  const [LoginEmailValid, setLoginEmailValid] = useState(false);
  const [LoginPasswordValid, setLoginPasswordValid] = useState(false);
  const [notLoginAllow, setNotLoginAllow] = useState(true);

  const loginPasswordInputRef = useRef(null);
  const loginConfirmButtonRef = useRef(null);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  useEffect(() => {
    if (LoginEmailValid && LoginPasswordValid) {
      setNotLoginAllow(false);
    } else {
      setNotLoginAllow(true);
    }
  }, [LoginEmailValid, LoginPasswordValid]);

  const handleLoginEmail = (e) => {
    setLoginEmail(e.target.value);
    const regex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    setLoginEmailValid(regex.test(e.target.value));
  };

  const handleLoginPassword = (e) => {
    setLoginPassword(e.target.value);
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

  //로그인 api 통신
  const onClickLoginButton = () => {
    fetch(`http://auth/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;"
      },
      body: JSON.stringify({
        email: loginEmail,
        password: LoginPassword,
      }),
    })
      .then((res) => res.json())
      .then(res => {
        console.log("백엔드: ", res);

        if (res.data && res.data.token) {
          alert("로그인 되었습니다.");
          // window.localStorage.setItem('token', res.data.token);
          window.location.href = '/';
        } else {
          alert("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
      })
      .catch(error => {
        alert("백엔드와 연결을 확인해주세요.");
        console.error('백엔드와의 통신 중 오류 발생:', error);
      });
  };

  //회원가입 api 통신
  const onClickSignUpButton = () => {
    fetch(`http://auth/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;"
      },
      body: JSON.stringify({
        // email: email,
        // password: password,
        // businessNumber: businessNumber,
        // companyName: companyName,
        // representativeName: representativeName,
        // businessType: businessType
      }),
    })
      .then((res) => res.json())
      .then(res => {
        console.log("백엔드: ", res);

        if (res.data && res.data.token) {
          alert("회원가입 되었습니다.");
          window.location.href = '/';
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
            {/*아이디(이메일 사용) 정보 입력*/}
            <input
              type="email"
              placeholder="이메일"
              value={loginEmail}
              onChange={handleLoginEmail}
              onKeyDown={handleLoginEmailKeyDown}
            />
            <div className="login-errorMessage">
              {!LoginEmailValid && loginEmail.length > 0 && (
                <div>올바른 이메일을 입력해주세요.</div>
              )}
            </div>

            {/*비밀번호 정보 입력*/}
            <input
              type="password"
              placeholder="비밀번호"
              value={LoginPassword}
              onChange={handleLoginPassword}
              onKeyDown={handleLoginPasswordKeyDown}
              ref={loginPasswordInputRef}
            />
            <div className="login-errorMessage">
              {!LoginPasswordValid && LoginPassword.length > 0 && (
                <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
              )}
            </div>

            {/* <a href="#">Forget Your Password?</a> */}
            <button onClick={onClickLoginButton} disabled={notLoginAllow} type="button">로그인</button>
          </form>
        </div>

        <div className="form-container sign-up">
          <form>
            <h1>회원가입</h1>
            <span>회원가입을 위한 정보를 입력해주세요.</span>
            <input type="text" placeholder="사업자등록번호 11자리" />
            <input type="email" placeholder="이메일" />
            <input type="password"
              placeholder="비밀번호"
            // value={password}
            // onChange={handlePassword}
            />
            {/* {(!passwordValid && password.length > 0) && (
              <div className="errorMessageWrap">영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
            )} */}
            <input type="password" placeholder="비밀번호확인" />
            <input type="text" placeholder="회사명" />
            <input type="text" placeholder="대표자명" />
            <input type="text" placeholder="업종" />
            <button type="button">회원가입</button>
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




// import React, { useState } from 'react';
// import '../../styles/Login.css';

// function Login() {
//   const [isActive, setIsActive] = useState(false);

//   const handleRegisterClick = () => {
//     setIsActive(true);
//   };

//   const handleLoginClick = () => {
//     setIsActive(false);
//   };

//   return (
//     <div className='login-frame'>
//       <div className={`login-container ${isActive ? 'active' : ''}`} id="login-container">
//         <div className="form-container sign-in">
//           <form>
//             <h1>로그인</h1>
//             <span>로그인을 위한 정보를 입력해주세요.</span>
//             <input type="email" placeholder="이메일" />
//             <input type="password" placeholder="비밀번호" />
//             {/* <a href="#">Forget Your Password?</a> */}
//             <button type="button">로그인</button>
//           </form>
//         </div>

//         <div className="form-container sign-up">
//           <form>
//             <h1>회원가입</h1>
//             <span>회원가입을 위한 정보를 입력해주세요.</span>
//             <input type="text" placeholder="사업자등록번호 11자리" />
//             <input type="email" placeholder="이메일" />
//             <input type="password" placeholder="비밀번호" />
//             <input type="text" placeholder="회사명" />
//             <input type="text" placeholder="대표자명" />
//             <input type="text" placeholder="업종" />
//             <button type="button">회원가입</button>
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