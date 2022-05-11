function toggleComment() {
  const commentEl = document.querySelector('#drawer-wrap');
  commentEl.classList.toggle('is-show');
}
function showReply(id) {
  const root = event.currentTarget.parentElement.nextElementSibling;
  console.log(root.childNodes);
  if (root.hasChildNodes()) {
    root.childNodes[0].remove();
    return;
  }
  const replyForm = document.createElement('div');
  replyForm.className = 'reply-form';
  const replyInput = document.createElement('input');
  replyInput.placeholder = '说点什么吧';
  replyInput.type = 'text';
  const replyOpt = document.createElement('div');
  replyOpt.className = 'reply-opt';
  const cancleBtn = document.createElement('button');
  cancleBtn.className = 'cancle-btn';
  cancleBtn.innerHTML = '取消';
  const commentBtn = document.createElement('button');
  commentBtn.className = 'comment-btn';
  commentBtn.innerHTML = '评论';
  cancleBtn.onclick = () => {
    replyForm.remove();
  };
  // 组装
  replyOpt.append(cancleBtn, commentBtn);
  replyForm.append(replyInput, replyOpt);
  root.append(replyForm);
}

window.onload = function () {
  markdownToc.chain.init();
  window.addEventListener('scroll', function () {
    markdownToc.chain.scroll();
  });
  hljs.highlightAll();
};

function thumbUp(pid) {
  const likeWrap = event.currentTarget;
  const liked = JSON.parse(localStorage.getItem('liked'));
  if (liked && liked.includes(pid)) {
    return;
  } else {
    const newLiked = Array.isArray(liked) ? liked : [];
    axios.post(`/api/article/thumb-up/${pid}`).then((res) => {
      newLiked.push(pid);
      localStorage.setItem('liked', JSON.stringify(newLiked));
      const { data: d } = res;
      const { data } = d;
      if (data) {
        const likes = data.likes;
        const likesEl = document.querySelector('#likes');
        likesEl.innerHTML = likes;
        likeWrap.style.color = 'var(--color-purple-500)';
        likeWrap.disabled = true;
      }
    });
  }
}
const GLOBAL = {
  PID: '',
  message: new Message(),
};
window.onload = () => {
  const token = localStorage.getItem('access_token');
  if (token && token !== '') {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }
  const pid = location.pathname.split('/')[2];
  GLOBAL.PID = pid;
  const liked = JSON.parse(localStorage.getItem('liked'));
  if (liked && liked.includes(pid)) {
    const likeWrap = document.querySelector('#like-btn');
    likeWrap.style.color = 'var(--color-purple-500)';
    likeWrap.disabled = true;
  }
};

function handleComment() {
  const commentInput = document.querySelector('#content-input');
  const content = commentInput.value;
  if (content.trim() !== '') {
    axios
      .post('/api/comment', { pid: GLOBAL.PID, content })
      .then((res) => {
        const { data } = res;
        if (data) {
          const commentList = document.querySelector('.comment-list');
          const commentItem = createCommentItem({
            from: data.from,
            create_at: new Date(data.create_at).toLocaleString(),
            content: data.content,
            commentId: data.commentId,
          });
          commentList.insertBefore(commentItem, commentList.children[0]);
        }
      })
      .catch((err) => {
        if (err.response) {
          const { response } = err;
          if (response.status === 401) {
            GLOBAL.message.error('未登录！ 请登陆后再评论');
          }
        }
      });
  } else {
    GLOBAL.message.error('评论内容不能为空！');
  }
}

function createCommentItem(data) {
  const commentItem = document.createElement('div');
  commentItem.className = 'comment-item';
  const template = document.getElementById('comment-item-template');
  const html = template.innerHTML;
  const reg = new RegExp('\\[([^\\[\\]]*?)\\]', 'igm');
  const source = html.replace(reg, (node, key) => {
    return data[key];
  });
  commentItem.innerHTML = source;
  console.log(commentItem);
  return commentItem;
}

function createReplyItem(data) {
  const replyItem = document.createElement('div');
  replyItem.className = 'reply-item';
  const template = document.getElementById('reply-item-template');
  const html = template.innerHTML;
  const reg = new RegExp('\\[([^\\[\\]]*?)\\]', 'igm');
  const source = html.replace(reg, (node, key) => {
    return data[key];
  });
  replyItem.innerHTML = source;
  return replyItem;
}

function toggleReplyForm(id, commentId, to) {
  const replyWrap = document.getElementById('reply-' + id);
  if (
    replyWrap.children[0] &&
    replyWrap.children[0].className === 'reply-form'
  ) {
    replyWrap.removeChild(replyWrap.children[0]);
    return;
  }
  replyWrap.classList.toggle('show');
  const reg = new RegExp('\\[([^\\[\\]]*?)\\]', 'igm');
  const replyForm = document.createElement('div');
  replyForm.className = 'reply-form';
  const data = { id, commentId, to };
  const replyHtml = document.getElementById('reply-form-template').innerHTML;
  const source = replyHtml.replace(reg, (node, key) => {
    return data[key];
  });
  replyForm.innerHTML = source;
  replyWrap.insertBefore(replyForm, replyWrap.children[0]);
  const replyFormInput = document.getElementById('reply-input-' + id);
  replyFormInput.focus();
}

function handleReply(id, commentId, to) {
  const content = document.getElementById('reply-input-' + id).value;
  if (content.trim() !== '') {
    axios
      .post('/api/comment/reply', {
        to_user: to,
        content: content,
        commentId: commentId,
      })
      .then((res) => {
        const data = res.data;
        if (data) {
          toggleReplyForm(id);
          const reply = createReplyItem({
            ...data,
            create_at: new Date(data.create_at).toLocaleString(),
          });
          const replyWrap = document.getElementById('reply-' + commentId);
          replyWrap.insertBefore(reply, replyWrap?.children[0]);
        }
      })
      .catch((err) => {
        if (err.response) {
          const { response } = err;
          if (response.status === 401) {
            GLOBAL.message.error('未登录！ 请登陆后再回复');
          }
        }
      });
  } else {
    GLOBAL.message.error('回复内容不能为空！');
  }
}
