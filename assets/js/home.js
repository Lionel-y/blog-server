// 设置全局请求头
window.onload = () => {
  const token = localStorage.getItem('access_token');
  if (token && token !== '') {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios.get('/api/user/profile').then((res) => {
      const data = res.data;
      if (data && data.statusCode === 200) {
        if (data.data.user.role === 0) {
          const adminEl = document.querySelector('#dashboard');
          adminEl.classList.add('show');
        }
        const logginStatus = document.querySelector('#user-status');
        const usernameEl = document.querySelector('#username');
        logginStatus.classList.add('logined');
        usernameEl.innerHTML = data.data.user.username;
      }
    });
  }
};

function onIsAdminChange() {
  const target = event.target;
  const passwordInput = document.querySelector('#passwordInput');
  if (target.checked) {
    // 是admin
    passwordInput.setAttribute('name', 'password');
    passwordInput.setAttribute('placeholder', '请输入密码');
  } else {
    passwordInput.setAttribute('name', 'email');
    passwordInput.setAttribute('placeholder', '请输入邮箱');
  }
}

function toggleLogin() {
  const loginWrap = document.querySelector('#login-wrap');
  loginWrap.classList.toggle('show');
}

function handleSubmit() {
  const loginForm = document.querySelector('#login-form');
  const inputMsg = document.querySelector('#input-message');
  const inputEl = document.querySelector('#usernameInput');
  const isAdmin = document.querySelector('#isAdmin').checked;
  const form = new FormData(loginForm);
  const data = {};
  form.forEach((value, key) => (data[key] = value));
  if (isAdmin) {
    // 管理员登录接口
    axios.post('/auth/admin/login', data).then((res) => {
      const data = res.data;
      if (data && data.success) {
        window.localStorage.setItem('access_token', data.access_token);
        location.href = '/';
      } else {
        const msg = data.msg;
        inputMsg.classList.add('error');
        inputEl.classList.add('error');
        inputMsg.innerHTML = msg || '服务器错误';
      }
    });
  } else {
    axios.post('/auth/user/login', data).then((res) => {
      const data = res.data;
      if (data && data.success) {
        window.localStorage.setItem('access_token', data.access_token);
        location.href = '/';
      } else {
        const msg = data.msg;
        inputMsg.classList.add('error');
        inputEl.classList.add('error');
        inputMsg.innerHTML = msg || '服务器错误';
      }
    });
  }
}

function handleInputFocus() {
  const target = event.target;
  const inputMsg = document.querySelector('#input-message');
  target.classList.remove('error');
  inputMsg.classList.remove('error');
}

function gotoArticle(pid) {
  event.preventDefault();
  const readedArticles = JSON.parse(localStorage.getItem('readed'));
  console.log(readedArticles);
  if (readedArticles && readedArticles.includes(pid)) {
    location.href = `/article/${pid}`;
  } else {
    const newReaded = Array.isArray(readedArticles) ? [...readedArticles] : [];
    console.log(newReaded);
    axios.get(`api/article/view_count/${pid}`).then(() => {
      newReaded.push(pid);
      localStorage.setItem('readed', JSON.stringify(newReaded));
      location.href = `/article/${pid}`;
    });
  }
}
