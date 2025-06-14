document.addEventListener('DOMContentLoaded', () => {
    // Показать поиск только на главной странице
    if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/') {
        const searchForm = document.getElementById('searchForm');
        if (searchForm) searchForm.style.display = 'block';
    }

    // Показ иконки пользователя, если авторизован
    const userData = localStorage.getItem('user');
    const authArea = document.getElementById('auth-area');
    if (userData && authArea) {
        const user = JSON.parse(userData);
        authArea.innerHTML = `
      <img src="${user.photoURL || '/images/default-avatar.png'}" alt="Avatar" style="width:24px; height:24px; border-radius:50%; vertical-align:middle; margin-right:5px;">
      ${user.name || 'User'}
      <button id="logout-btn" style="margin-left:10px; cursor:pointer;">Logout</button>
    `;

        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('user');
            // Можно добавить signOut из Firebase, если есть
            window.location.href = '/pages/index.html';
        });
    }
});