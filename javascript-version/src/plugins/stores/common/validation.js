export const validateCtn = (ctn) => {
    const ctnRegex = /^\d{11}$/;
    return ctnRegex.test(ctn) ? '' : 'CTN은 11자리 숫자여야 합니다.';
};


export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : '유효한 이메일 주소를 입력하세요.';
};


export const validateName = (name) => {
    const nameRegex = /^[a-zA-Z가-힣]{2,16}$/;
    return nameRegex.test(name) ? '' : '이름은 2~16자의 영문 또는 한글만 입력 가능합니다.';
};


export const validateTeam = (team) => {
    return team.trim() === '' ? '소속을 입력하세요.' : '';
};


export const validateRole = (role) => {
    return role ? '' : '권한을 선택하세요.';
};


export const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]{4,16}$/;
    return usernameRegex.test(username) ? '' : '아이디는 4~16자의 영문 또는 숫자로 구성되어야 합니다.';
};


export const validatePassword = (password) => {
    const passwordRegex = /^(?!((?:[A-Z]+)|(?:[a-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{6,20}$/;
    return passwordRegex.test(password) ? '' : '비밀번호는 6~20자로 영문, 숫자, 특수문자 중 두 종류를 포함해야 합니다.';
};


export const validatePasswordConfirm = (password, passwordConfirm) => {
    return password === passwordConfirm ? '' : '비밀번호 확인이 일치하지 않습니다.';
};


export const validateInputtedCtn = (ctn) => {
    const numberRegex = /^\d{4,}$/;
    return numberRegex.test(ctn) ? '' : '공백을 포함하지 않는 4자리 이상 번호만을 입력하세요.';
};


// export const validateFeetypeCode = (feetypeCode) => {
//     const feetypeCodeRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/;
//     return feetypeCodeRegex.test(feetypeCode) ? '' : '요금제 코드는';
// };


// export const validateFeetypeName = (feetypeName) => {
//     const feetypeNameRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/;
//     return feetypeNameRegex.test(feetypeName) ? '' : '요금제 이름은';
// };
