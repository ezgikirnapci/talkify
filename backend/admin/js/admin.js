/**
 * Talkify Admin Panel - JavaScript
 */

const API_BASE = '/api/admin';

// Admin key for authentication (stored in sessionStorage)
function getAdminKey() {
    let key = sessionStorage.getItem('adminKey');
    if (!key) {
        key = prompt('Admin anahtarını girin:');
        if (key) {
            sessionStorage.setItem('adminKey', key);
        }
    }
    return key;
}

// ==================== API CALLS ====================

async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Add admin key for write operations
    if (method !== 'GET') {
        const adminKey = getAdminKey();
        if (adminKey) {
            options.headers['X-Admin-Key'] = adminKey;
        }
    }

    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const json = await response.json();

        if (!response.ok) {
            if (response.status === 403) {
                sessionStorage.removeItem('adminKey');
                showToast('Geçersiz admin anahtarı. Sayfayı yenileyin.', 'error');
            }
            throw new Error(json.message || 'API hatası');
        }

        return json;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}


// ==================== TOAST NOTIFICATIONS ====================

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== MODAL FUNCTIONS ====================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

// ==================== UTILITY FUNCTIONS ====================

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatShortDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'short'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== PAGINATION ====================

function createPagination(pagination, onPageChange) {
    const { page, total_pages, has_prev, has_next } = pagination;

    if (total_pages <= 1) return '';

    let html = '<div class="pagination">';

    // Previous button
    html += `
        <button class="pagination-btn" 
                onclick="${onPageChange}(${page - 1})" 
                ${!has_prev ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    // Page numbers
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(total_pages, page + 2);

    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button class="pagination-btn ${i === page ? 'active' : ''}" 
                    onclick="${onPageChange}(${i})">
                ${i}
            </button>
        `;
    }

    // Next button
    html += `
        <button class="pagination-btn" 
                onclick="${onPageChange}(${page + 1})" 
                ${!has_next ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    html += '</div>';
    return html;
}

// ==================== USERS PAGE ====================

let currentUsersPage = 1;
let usersSearchTerm = '';

async function loadUsers(page = 1) {
    currentUsersPage = page;

    try {
        const params = new URLSearchParams({
            page,
            per_page: 10,
            search: usersSearchTerm
        });

        const response = await apiCall(`/users?${params}`);

        if (response.success) {
            renderUsersTable(response.data.users);
            document.getElementById('usersPagination').innerHTML =
                createPagination(response.data.pagination, 'loadUsers');
        }
    } catch (error) {
        showToast('Kullanıcılar yüklenemedi', 'error');
    }
}

function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>Kullanıcı bulunamadı</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; font-weight: 600;">
                        ${(user.username || user.email)[0].toUpperCase()}
                    </div>
                    <div>
                        <div style="font-weight: 500;">${user.username || '-'}</div>
                        <div style="font-size: 12px; color: var(--text-muted);">${user.email}</div>
                    </div>
                </div>
            </td>
            <td><span class="level-badge level-${user.language_level}">${user.language_level}</span></td>
            <td>${user.words_learned || 0}</td>
            <td>${user.test_count || 0}</td>
            <td>${formatShortDate(user.created_at)}</td>
            <td>
                <button class="btn btn-danger btn-icon btn-sm" onclick="deleteUser(${user.id}, '${user.email}')" title="Sil">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function deleteUser(userId, email) {
    if (!confirm(`"${email}" kullanıcısını silmek istediğinize emin misiniz?`)) {
        return;
    }

    try {
        await apiCall(`/users/${userId}`, 'DELETE');
        showToast('Kullanıcı silindi');
        loadUsers(currentUsersPage);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ==================== WORDS PAGE ====================

let currentWordsPage = 1;
let wordsSearchTerm = '';
let wordsFilter = { level: '', category: '' };

async function loadWords(page = 1) {
    currentWordsPage = page;

    try {
        const params = new URLSearchParams({
            page,
            per_page: 15,
            search: wordsSearchTerm,
            level: wordsFilter.level,
            category: wordsFilter.category
        });

        const response = await apiCall(`/words?${params}`);

        if (response.success) {
            renderWordsTable(response.data.words);
            document.getElementById('wordsPagination').innerHTML =
                createPagination(response.data.pagination, 'loadWords');
        }
    } catch (error) {
        showToast('Kelimeler yüklenemedi', 'error');
    }
}

function renderWordsTable(words) {
    const tbody = document.getElementById('wordsTableBody');
    if (!tbody) return;

    if (words.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-book"></i>
                    <p>Kelime bulunamadı</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = words.map(word => `
        <tr>
            <td><strong>${word.word}</strong></td>
            <td>${word.meaning}</td>
            <td><span class="level-badge level-${word.level}">${word.level}</span></td>
            <td><span class="badge badge-info">${word.category || '-'}</span></td>
            <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${word.example_sentence || '-'}
            </td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary btn-icon btn-sm" onclick="editWord(${word.id})" title="Düzenle">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-icon btn-sm" onclick="deleteWord(${word.id}, '${word.word}')" title="Sil">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddWordModal() {
    document.getElementById('wordModalTitle').textContent = 'Yeni Kelime Ekle';
    document.getElementById('wordForm').reset();
    document.getElementById('wordId').value = '';
    openModal('wordModal');
}

async function editWord(wordId) {
    try {
        // Get word details from the table or make an API call
        const response = await fetch(`/api/words/${wordId}`);
        const json = await response.json();

        if (json.success) {
            const word = json.data.word;
            document.getElementById('wordModalTitle').textContent = 'Kelime Düzenle';
            document.getElementById('wordId').value = word.id;
            document.getElementById('wordText').value = word.word;
            document.getElementById('wordMeaning').value = word.meaning;
            document.getElementById('wordLevel').value = word.level;
            document.getElementById('wordCategory').value = word.category || '';
            document.getElementById('wordExample').value = word.example_sentence || '';
            document.getElementById('wordExampleTr').value = word.example_translation || '';
            openModal('wordModal');
        }
    } catch (error) {
        showToast('Kelime bilgileri alınamadı', 'error');
    }
}

async function saveWord() {
    const wordId = document.getElementById('wordId').value;
    const data = {
        word: document.getElementById('wordText').value,
        meaning: document.getElementById('wordMeaning').value,
        level: document.getElementById('wordLevel').value,
        category: document.getElementById('wordCategory').value,
        example_sentence: document.getElementById('wordExample').value,
        example_translation: document.getElementById('wordExampleTr').value
    };

    try {
        if (wordId) {
            await apiCall(`/words/${wordId}`, 'PUT', data);
            showToast('Kelime güncellendi');
        } else {
            await apiCall('/words', 'POST', data);
            showToast('Kelime eklendi');
        }

        closeModal('wordModal');
        loadWords(currentWordsPage);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function deleteWord(wordId, word) {
    if (!confirm(`"${word}" kelimesini silmek istediğinize emin misiniz?`)) {
        return;
    }

    try {
        await apiCall(`/words/${wordId}`, 'DELETE');
        showToast('Kelime silindi');
        loadWords(currentWordsPage);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Load categories for filter
async function loadCategories() {
    try {
        const response = await apiCall('/categories');
        if (response.success) {
            const select = document.getElementById('categoryFilter');
            if (select) {
                response.data.categories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat;
                    option.textContent = cat;
                    select.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Categories load error:', error);
    }
}

// ==================== QUIZZES PAGE ====================

let currentQuizzesPage = 1;

async function loadQuizzes(page = 1) {
    currentQuizzesPage = page;

    try {
        const params = new URLSearchParams({ page, per_page: 10 });
        const response = await apiCall(`/quizzes?${params}`);

        if (response.success) {
            renderQuizzesTable(response.data.quizzes);
            document.getElementById('quizzesPagination').innerHTML =
                createPagination(response.data.pagination, 'loadQuizzes');
        }
    } catch (error) {
        showToast('Quizler yüklenemedi', 'error');
    }
}

function renderQuizzesTable(quizzes) {
    const tbody = document.getElementById('quizzesTableBody');
    if (!tbody) return;

    if (quizzes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-question-circle"></i>
                    <p>Quiz bulunamadı</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = quizzes.map(quiz => `
        <tr>
            <td><strong>${quiz.title}</strong></td>
            <td>${quiz.description || '-'}</td>
            <td><span class="level-badge level-${quiz.level}">${quiz.level}</span></td>
            <td><span class="badge badge-primary">${quiz.category || '-'}</span></td>
            <td>${quiz.question_count} soru</td>
            <td>${quiz.attempts || 0} deneme</td>
            <td>
                <button class="btn btn-danger btn-icon btn-sm" onclick="deleteQuiz(${quiz.id}, '${quiz.title}')" title="Sil">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function deleteQuiz(quizId, title) {
    if (!confirm(`"${title}" quizini silmek istediğinize emin misiniz?`)) {
        return;
    }

    try {
        await apiCall(`/quizzes/${quizId}`, 'DELETE');
        showToast('Quiz silindi');
        loadQuizzes(currentQuizzesPage);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ==================== SEARCH HANDLERS ====================

const handleUsersSearch = debounce((value) => {
    usersSearchTerm = value;
    loadUsers(1);
}, 300);

const handleWordsSearch = debounce((value) => {
    wordsSearchTerm = value;
    loadWords(1);
}, 300);
