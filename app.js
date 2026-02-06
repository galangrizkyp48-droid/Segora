// API Configuration
const API_BASE_URL = 'http://localhost:3000/v1';

// State
let currentUser = null;
let accessToken = null;
let posts = [];
let currentView = 'feed';
let currentProfile = null;

// DOM Elements
const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');
const feedElement = document.getElementById('feed');
const createPostBtn = document.getElementById('create-post-btn');
const navCreateBtn = document.getElementById('nav-create');
const createModal = document.getElementById('create-modal');
const closeModalBtn = document.getElementById('close-modal');
const postForm = document.getElementById('post-form');
const logoutBtn = document.getElementById('logout-btn');
const loadingElement = document.getElementById('loading');
const searchBtn = document.getElementById('search-btn');

// Initialize
async function init() {
    accessToken = localStorage.getItem('access_token');

    if (accessToken) {
        await loadCurrentUser();
    } else {
        showAuthScreen();
    }

    await loadCampuses();
    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    createPostBtn.addEventListener('click', () => createModal.classList.add('active'));
    navCreateBtn.addEventListener('click', () => createModal.classList.add('active'));
    closeModalBtn.addEventListener('click', () => createModal.classList.remove('active'));

    postForm.addEventListener('submit', handleCreatePost);
    logoutBtn.addEventListener('click', handleLogout);
    searchBtn.addEventListener('click', showSearchModal);

    // Post type toggle
    document.querySelectorAll('input[name="post-type"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const listingFields = document.getElementById('listing-fields');
            if (e.target.value === 'listing') {
                listingFields.style.display = 'block';
            } else {
                listingFields.style.display = 'none';
            }
        });
    });

    // Bottom nav
    document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
}

// Navigation
function switchView(view) {
    currentView = view;
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${view}"]`)?.classList.add('active');

    if (view === 'feed') {
        loadFeed();
    } else if (view === 'profile') {
        showProfile(currentUser.username);
    }
}

// API Calls
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth Functions
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        showLoading(true);
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        accessToken = response.data.tokens.access_token;
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', response.data.tokens.refresh_token);

        currentUser = response.data.user;

        showAppScreen();
        await loadFeed();
    } catch (error) {
        showMessage(error.message || 'Login gagal. Periksa email dan password Anda.', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const email = document.getElementById('register-email').value;
    const username = document.getElementById('register-username').value;
    const display_name = document.getElementById('register-display-name').value;
    const password = document.getElementById('register-password').value;
    const campus_id = document.getElementById('register-campus').value;

    try {
        showLoading(true);
        const response = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email,
                username,
                display_name: display_name || username,
                password,
                campus_id
            })
        });

        accessToken = response.data.tokens.access_token;
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', response.data.tokens.refresh_token);

        currentUser = response.data.user;

        showAppScreen();
        await loadFeed();
    } catch (error) {
        showMessage(error.message || 'Registrasi gagal. Silakan coba lagi.', 'error');
    } finally {
        showLoading(false);
    }
}

async function loadCurrentUser() {
    try {
        const response = await apiCall('/auth/me');
        currentUser = response.data;
        showAppScreen();
        await loadFeed();
    } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        showAuthScreen();
    }
}

function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    accessToken = null;
    currentUser = null;
    showAuthScreen();
}

// Feed Functions
async function loadFeed() {
    try {
        showLoading(true);
        const response = await apiCall('/feed');
        posts = response.data;
        renderFeed();
    } catch (error) {
        showMessage('Gagal memuat feed. Silakan refresh halaman.', 'error');
    } finally {
        showLoading(false);
    }
}

function renderFeed() {
    if (posts.length === 0) {
        feedElement.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
                <h3 style="margin-bottom: 8px;">Belum ada postingan</h3>
                <p>Jadilah yang pertama berbagi sesuatu!</p>
            </div>
        `;
        return;
    }

    feedElement.innerHTML = posts.map(post => renderPost(post)).join('');

    // Attach event listeners
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', () => handleLike(btn.dataset.postId));
    });
    document.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', () => showReplyModal(btn.dataset.postId));
    });
    document.querySelectorAll('.repost-btn').forEach(btn => {
        btn.addEventListener('click', () => handleRepost(btn.dataset.postId));
    });
    document.querySelectorAll('.username-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showProfile(link.dataset.username);
        });
    });
}

function renderPost(post) {
    const initials = post.User.display_name.substring(0, 2).toUpperCase();
    const timeAgo = formatTimeAgo(new Date(post.created_at));
    const isLiked = post.is_liked || false;

    return `
        <div class="post-card glass-card">
            <div class="post-header">
                <div class="avatar">${initials}</div>
                <div class="post-user-info">
                    <div class="username">
                        <a href="#" class="username-link" data-username="${post.User.username}">${post.User.display_name}</a>
                        ${post.User.student_verified ? '<span class="verified-badge">✓</span>' : ''}
                    </div>
                    <div class="post-time">${timeAgo}</div>
                </div>
            </div>
            <div class="post-content">
                ${post.content}
                ${post.Listing ? `<div class="listing-badge">💰 Rp ${formatPrice(post.Listing.price)}</div>` : ''}
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span>${post.likes_count}</span>
                </button>
                <button class="action-btn reply-btn" data-post-id="${post.id}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    <span>${post.replies_count}</span>
                </button>
                <button class="action-btn repost-btn" data-post-id="${post.id}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="17 1 21 5 17 9"/>
                        <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                        <polyline points="7 23 3 19 7 15"/>
                        <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                    </svg>
                    <span>${post.reposts_count}</span>
                </button>
            </div>
        </div>
    `;
}

// Create Post
async function handleCreatePost(e) {
    e.preventDefault();

    const content = document.getElementById('post-content').value;
    const postType = document.querySelector('input[name="post-type"]:checked').value;

    const postData = { content, post_type: postType };

    if (postType === 'listing') {
        const title = document.getElementById('listing-title').value;
        const price = document.getElementById('listing-price').value;
        const listing_type = document.getElementById('listing-type').value;

        if (!title || !listing_type) {
            showMessage('Harap lengkapi detail produk/jasa', 'error');
            return;
        }

        try {
            const listingResponse = await apiCall('/listings', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    description: content,
                    price: parseFloat(price) || 0,
                    listing_type
                })
            });

            postData.listing_id = listingResponse.data.id;
        } catch (error) {
            showMessage('Gagal membuat listing. Silakan coba lagi.', 'error');
            return;
        }
    }

    try {
        showLoading(true);
        await apiCall('/posts', {
            method: 'POST',
            body: JSON.stringify(postData)
        });

        createModal.classList.remove('active');
        postForm.reset();
        document.getElementById('listing-fields').style.display = 'none';

        await loadFeed();
        showMessage('Postingan berhasil dibuat! 🎉', 'success');
    } catch (error) {
        showMessage('Gagal membuat postingan. Coba lagi.', 'error');
    } finally {
        showLoading(false);
    }
}

// Like Post
async function handleLike(postId) {
    const post = posts.find(p => p.id === postId);
    const isLiked = post.is_liked;

    try {
        if (isLiked) {
            await apiCall(`/posts/${postId}/like`, { method: 'DELETE' });
            post.is_liked = false;
            post.likes_count--;
        } else {
            await apiCall(`/posts/${postId}/like`, { method: 'POST' });
            post.is_liked = true;
            post.likes_count++;
        }

        renderFeed();
    } catch (error) {
        console.error('Failed to like post:', error);
    }
}

// Reply to Post
function showReplyModal(postId) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content glass-card">
            <div class="modal-header">
                <h2>Reply</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <form id="reply-form">
                <div class="input-group">
                    <textarea id="reply-content" placeholder="Write your reply..." rows="3" required></textarea>
                </div>
                <button type="submit" class="btn-primary">Reply</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('reply-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = document.getElementById('reply-content').value;

        try {
            await apiCall(`/posts/${postId}/reply`, {
                method: 'POST',
                body: JSON.stringify({ content })
            });

            modal.remove();
            await loadFeed();
            showMessage('Balasan berhasil dikirim! 💬', 'success');
        } catch (error) {
            showMessage('Gagal mengirim balasan. Coba lagi.', 'error');
        }
    });
}

// Repost
async function handleRepost(postId) {
    if (!confirm('Repost this to your followers?')) return;

    try {
        await apiCall(`/posts/${postId}/repost`, { method: 'POST' });
        await loadFeed();
        showMessage('Berhasil di-repost! 🔁', 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Profile View
async function showProfile(username) {
    try {
        showLoading(true);
        const response = await apiCall(`/users/${username}`);
        currentProfile = response.data;

        feedElement.innerHTML = `
            <div class="profile-header glass-card" style="margin-bottom: 20px; padding: 24px;">
                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                    <div class="avatar" style="width: 80px; height: 80px; font-size: 32px;">
                        ${currentProfile.user.display_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div style="flex: 1;">
                        <div class="username" style="font-size: 24px; margin-bottom: 4px;">
                            ${currentProfile.user.display_name}
                            ${currentProfile.user.student_verified ? '<span class="verified-badge">✓</span>' : ''}
                        </div>
                        <div style="color: var(--text-secondary); margin-bottom: 8px;">@${currentProfile.user.username}</div>
                        ${currentProfile.user.bio ? `<p style="margin-bottom: 12px;">${currentProfile.user.bio}</p>` : ''}
                        <div style="display: flex; gap: 16px; margin-bottom: 12px;">
                            <span><strong>${currentProfile.user.followers_count}</strong> Followers</span>
                            <span><strong>${currentProfile.user.following_count}</strong> Following</span>
                            ${currentProfile.user.rating_count > 0 ? `<span>⭐ ${currentProfile.user.rating_avg}/5</span>` : ''}
                        </div>
                        ${currentProfile.user.username !== currentUser.username ? `
                            <button class="btn-primary" onclick="handleFollow('${username}', ${currentProfile.user.is_following})" style="width: auto; padding: 10px 24px;">
                                ${currentProfile.user.is_following ? 'Unfollow' : 'Follow'}
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
            <h3 style="margin-bottom: 16px;">Posts</h3>
            ${currentProfile.posts.map(post => renderPost(post)).join('')}
        `;

        // Re-attach event listeners
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', () => handleLike(btn.dataset.postId));
        });
    } catch (error) {
        showMessage('Gagal memuat profil. Silakan coba lagi.', 'error');
    } finally {
        showLoading(false);
    }
}

// Follow/Unfollow
async function handleFollow(username, isFollowing) {
    try {
        if (isFollowing) {
            await apiCall(`/users/${username}/follow`, { method: 'DELETE' });
        } else {
            await apiCall(`/users/${username}/follow`, { method: 'POST' });
        }

        showProfile(username);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Search
function showSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content glass-card">
            <div class="modal-header">
                <h2>Search</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="input-group">
                <input type="text" id="search-input" placeholder="Search users, posts..." autofocus>
            </div>
            <div id="search-results"></div>
        </div>
    `;
    document.body.appendChild(modal);

    const searchInput = document.getElementById('search-input');
    let timeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => performSearch(e.target.value), 500);
    });
}

async function performSearch(query) {
    if (query.length < 2) return;

    try {
        const [usersRes, postsRes] = await Promise.all([
            apiCall(`/search/users?q=${encodeURIComponent(query)}`),
            apiCall(`/search/posts?q=${encodeURIComponent(query)}`)
        ]);

        const resultsDiv = document.getElementById('search-results');
        resultsDiv.innerHTML = `
            <h3 style="margin-top: 20px;">Users</h3>
            ${usersRes.data.map(user => `
                <div class="post-card glass-card" style="padding: 12px; cursor: pointer;" onclick="showProfile('${user.username}'); document.querySelector('.modal').remove();">
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <div class="avatar" style="width: 40px; height: 40px;">
                            ${user.display_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div class="username">${user.display_name} ${user.student_verified ? '<span class="verified-badge">✓</span>' : ''}</div>
                            <div style="color: var(--text-secondary); font-size: 12px;">@${user.username}</div>
                        </div>
                    </div>
                </div>
            `).join('')}
            <h3 style="margin-top: 20px;">Posts</h3>
            ${postsRes.data.map(post => renderPost(post)).join('')}
        `;
    } catch (error) {
        console.error('Search failed:', error);
    }
}

// Load Campuses
async function loadCampuses() {
    try {
        const response = await apiCall('/campuses');
        const select = document.getElementById('register-campus');

        response.data.forEach(campus => {
            const option = document.createElement('option');
            option.value = campus.id;
            option.textContent = campus.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load campuses:', error);
    }
}

// UI Helpers
function showAuthScreen() {
    authScreen.classList.add('active');
    appScreen.classList.remove('active');
}

function showAppScreen() {
    authScreen.classList.remove('active');
    appScreen.classList.add('active');
}

function showLoading(show) {
    loadingElement.style.display = show ? 'block' : 'none';
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    const container = document.querySelector('.auth-form:not([style*="display: none"])') || document.querySelector('.feed-container');
    container.insertBefore(messageDiv, container.firstChild);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
}

// Start app
init();
