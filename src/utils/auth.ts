// Mở popup đăng nhập với Google
export function loginWithGoogle(callback?: () => void) {
  const popup = window.open(
    'https://localhost:44366/auth/login',
    'googleLogin',
    'width=500,height=600',
  );

  const listener = (e: MessageEvent) => {
    const d = e.data;
    if (d.jwt) {
      localStorage.setItem('jwtToken', d.jwt);
      localStorage.setItem('userName', d.userName || '');
      localStorage.setItem('userId', d.userId || '');
      localStorage.setItem('profileImage', d.profileImage || '');
      localStorage.setItem('expiresAt', d.expiresAt || '');
      window.removeEventListener('message', listener); // cleanup
      callback?.();
    }
  };

  window.addEventListener('message', listener);
}

// Đăng xuất: xóa token
export function logout() {
  localStorage.clear();
  window.location.reload();
}

// Lấy JWT hiện tại
export function getJwt() {
  return localStorage.getItem('jwtToken');
}

// Làm mới token nếu gần hết hạn
export async function autoRefreshToken() {
  const expiresAt = localStorage.getItem('expiresAt');
  if (!expiresAt) return;

  const expireTime = new Date(expiresAt).getTime();
  const now = new Date().getTime();

  if (expireTime - now < 5 * 60 * 1000) { // Nếu còn dưới 5 phút
    const res = await fetch('https://localhost:44366/auth/refreshtoken', {
      headers: {
        Authorization: `Bearer ${getJwt()}`,
      },
    });
    const data = await res.json();
    if (data.jwtAccessToken) {
      localStorage.setItem('jwtToken', data.jwtAccessToken);
      localStorage.setItem('expiresAt', data.expiresAt);
    }
  }
}


export function isAuthenticated() {
  const token = localStorage.getItem('jwtToken')
  const expiresAt = localStorage.getItem('expiresAt')

  if (!token || !expiresAt) return false

  const expireTime = new Date(expiresAt).getTime()
  const now = new Date().getTime()
  return expireTime > now // còn hạn thì hợp lệ
}