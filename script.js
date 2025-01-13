import { auth, db } from './firebase.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { 
    collection, 
    addDoc, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const logoutButton = document.getElementById('logout-button');
const bookForm = document.querySelector('#book-form form');
const booksList = document.getElementById('books-list');
const userName = document.getElementById('user-name');

// Atualizar interface com base no estado de autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        userName.textContent = `Olá, ${user.email}`;
        loginButton.classList.add('hidden');
        signupButton.classList.add('hidden');
        logoutButton.classList.remove('hidden');
        loadBooks();
    } else {
        userName.textContent = '';
        loginButton.classList.remove('hidden');
        signupButton.classList.remove('hidden');
        logoutButton.classList.add('hidden');
        booksList.innerHTML = '';
    }
});

loginButton.onclick = () => {
    const email = prompt('Digite seu e-mail:');
    const password = prompt('Digite sua senha:');
    if (email && password) {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => alert('Login realizado com sucesso!'))
            .catch((error) => alert('Erro ao fazer login: ' + error.message));
    }
};

signupButton.onclick = () => {
    const email = prompt('Digite seu e-mail:');
    const password = prompt('Digite sua senha:');
    if (email && password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => alert('Usuário cadastrado com sucesso!'))
            .catch((error) => alert('Erro ao cadastrar usuário: ' + error.message));
    }
};

logoutButton.onclick = () => {
    signOut(auth)
        .then(() => alert('Logout realizado com sucesso!'))
        .catch((error) => alert('Erro ao fazer logout: ' + error.message));
};

bookForm.onsubmit = async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const description = document.getElementById('description').value;

    if (title && author && genre && description) {
        try {
            await addDoc(collection(db, 'books'), { title, author, genre, description });
            alert('Livro cadastrado com sucesso!');
            bookForm.reset();
            loadBooks();
        } catch (error) {
            alert('Erro ao cadastrar livro: ' + error.message);
        }
    } else {
        alert('Por favor, preencha todos os campos.');
    }
};

const loadBooks = async () => {
    booksList.innerHTML = '';
    try {
        const querySnapshot = await getDocs(collection(db, 'books'));
        querySnapshot.forEach((doc) => {
            const book = doc.data();
            const bookDiv = document.createElement('div');
            bookDiv.className = 'book-item';
            bookDiv.innerHTML = `
                <h3>${book.title}</h3>
                <p><strong>Autor:</strong> ${book.author}</p>
                <p><strong>Gênero:</strong> ${book.genre}</p>
                <p>${book.description}</p>
                <button onclick="openCommentForm('${doc.id}')">Comentar</button>
                <div id="comments-${doc.id}" class="hidden">
                    <h4>Comentários</h4>
                    <ul></ul>
                    <input type="text" id="comment-name-${doc.id}" placeholder="Seu nome">
                    <textarea id="comment-text-${doc.id}" placeholder="Seu comentário"></textarea>
                    <button onclick="submitComment('${doc.id}')">Enviar</button>
                </div>
            `;
            booksList.appendChild(bookDiv);
        });
    } catch (error) {
        alert('Erro ao carregar livros: ' + error.message);
    }
};

window.openCommentForm = (bookId) => {
    const commentSection = document.getElementById(`comments-${bookId}`);
    if (commentSection) {
        commentSection.classList.toggle('hidden');
    }
};

window.submitComment = async (bookId) => {
    const nameField = document.getElementById(`comment-name-${bookId}`);
    const textField = document.getElementById(`comment-text-${bookId}`);
    const name = nameField.value;
    const text = textField.value;

    if (name && text) {
        try {
            const commentsList = document.querySelector(`#comments-${bookId} ul`);
            const commentItem = document.createElement('li');
            commentItem.textContent = `${name}: ${text}`;
            commentsList.appendChild(commentItem);

            nameField.value = '';
            textField.value = '';
            alert('Comentário enviado com sucesso!');
        } catch (error) {
            alert('Erro ao enviar comentário: ' + error.message);
        }
    } else {
        alert('Por favor, preencha seu nome e comentário.');
    }
};
