document.addEventListener('DOMContentLoaded', () => {
    const kanbanCards = document.querySelectorAll('.kanban-card');
    const kanbanColumns = document.querySelectorAll('.kanban-cards');
    const createTaskBtn = document.getElementById('create-task-btn');
    const taskTitleInput = document.getElementById('task-title');
    const taskPrioritySelect = document.getElementById('task-priority');
    const pendingColumn = document.querySelector('.kanban-cards[data-column-id="1"]');
    const managerPassword = "gerente";
    let draggedCard = null;

    // Função para buscar uma imagem aleatória da API Random User
    async function fetchRandomUserImage() {
        try {
            const response = await fetch('https://randomuser.me/api/');
            const data = await response.json();
            return data.results[0].picture.large; // Retorna a URL da foto grande
        } catch (error) {
            console.error('Erro ao buscar imagem da API:', error);
            return './img/smile-2072907_640.jpg'; // Retorna uma imagem padrão em caso de erro
        }
    }

    // Função para criar um novo card HTML
    async function createNewCard(title, priority) {
        const card = document.createElement('div');
        card.classList.add('kanban-card');
        card.setAttribute('draggable', false);

        const badge = document.createElement('div');
        badge.classList.add('badge', priority);
        badge.innerHTML = `<span>${priority === 'high' ? 'Alta prioridade' : (priority === 'medium' ? 'Média prioridade' : 'Baixa prioridade')}</span>`;

        const cardTitle = document.createElement('p');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = title;

        const cardInfos = document.createElement('div');
        cardInfos.classList.add('card-infos');
        const randomImageURL = await fetchRandomUserImage(); // Busca a URL da imagem
        cardInfos.innerHTML = `
            <div class="card-icons">
                <p><i class="fa-regular fa-comment"></i> 0</p>
                <p><i class="fa-solid fa-paperclip"></i> 0</p>
            </div>
            <div class="user">
                <img src="${randomImageURL}" alt="User">
            </div>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-card-btn');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

        const approveButton = document.createElement('button');
        approveButton.classList.add('approve-card-btn');
        approveButton.textContent = 'Aprovar';

        card.appendChild(badge);
        card.appendChild(cardTitle);
        card.appendChild(cardInfos);
        card.appendChild(deleteButton);
        card.appendChild(approveButton);

        approveButton.addEventListener('click', (e) => {
            const enteredPassword = prompt("Digite a senha do gerente para aprovar esta tarefa:");
            if (enteredPassword === managerPassword) {
                card.classList.add('approved');
                card.setAttribute('draggable', true);
                approveButton.remove();
                e.stopPropagation();
            } else if (enteredPassword !== null) {
                alert("Senha incorreta. A tarefa não foi aprovada.");
            }
        });

        card.addEventListener('dragstart', (e) => {
            if (card.classList.contains('approved')) {
                draggedCard = e.target;
                e.target.classList.add('dragging');
                console.log('Drag start:', draggedCard); // LOG
            } else {
                e.preventDefault();
            }
        });

        card.addEventListener('dragend', () => {
            if (draggedCard) {
                draggedCard.classList.remove('dragging');
                console.log('Drag end:', draggedCard); // LOG
                draggedCard = null;
            }
        });

        deleteButton.addEventListener('click', (e) => {
            const cardToDelete = e.target.closest('.kanban-card');
            if (cardToDelete) {
                cardToDelete.remove();
            }
            e.stopPropagation();
        });

        return card;
    }

    // Adiciona o botão de aprovar e exclusão aos cards existentes na coluna pendente (agora também busca imagem)
    pendingColumn.querySelectorAll('.kanban-card').forEach(async card => {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-card-btn');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        card.appendChild(deleteButton);

        const approveButton = document.createElement('button');
        approveButton.classList.add('approve-card-btn');
        approveButton.textContent = 'Aprovar';
        card.appendChild(approveButton);

        const userDiv = card.querySelector('.user');
        if (userDiv && userDiv.querySelector('img')) {
            const randomImageURL = await fetchRandomUserImage();
            userDiv.querySelector('img').src = randomImageURL;
        }

        approveButton.addEventListener('click', (e) => {
            const enteredPassword = prompt("Digite a senha do gerente para aprovar esta tarefa:");
            if (enteredPassword === managerPassword) {
                card.classList.add('approved');
                card.setAttribute('draggable', true);
                approveButton.remove();
                e.stopPropagation();
            } else if (enteredPassword !== null) {
                alert("Senha incorreta. A tarefa não foi aprovada.");
            }
        });

        deleteButton.addEventListener('click', (e) => {
            const cardToDelete = e.target.closest('.kanban-card');
            if (cardToDelete) {
                cardToDelete.remove();
            }
            e.stopPropagation();
        });

        card.setAttribute('draggable', false);
        card.addEventListener('dragstart', (e) => {
            if (card.classList.contains('approved')) {
                draggedCard = e.target;
                e.target.classList.add('dragging');
                console.log('Drag start (existing card):', draggedCard); // LOG
            } else {
                e.preventDefault();
            }
        });
        card.addEventListener('dragend', () => {
            if (draggedCard) {
                draggedCard.classList.remove('dragging');
                console.log('Drag end (existing card):', draggedCard); // LOG
                draggedCard = null;
            }
        });
    });

    // Event listener para o botão de criar tarefa
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', async () => {
            const title = taskTitleInput.value.trim();
            const priority = taskPrioritySelect.value;

            if (title) {
                const newCard = await createNewCard(title, priority);
                pendingColumn.appendChild(newCard);

                taskTitleInput.value = '';
                taskPrioritySelect.value = 'high';
            } else {
                alert('Por favor, insira um título para a tarefa.');
            }
        });
    }

    // Lógica de drag and drop
    kanbanColumns.forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!e.currentTarget.classList.contains('cards-hover')) {
                e.currentTarget.classList.add('cards-hover');
                console.log('Drag over column:', e.currentTarget); // LOG
            }
        });

        column.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('cards-hover');
            console.log('Drag leave column:', e.currentTarget); // LOG
        });

        column.addEventListener('drop', (e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('cards-hover');
            console.log('Drop on column:', e.currentTarget); // LOG
            console.log('Dropped card:', draggedCard); // LOG
            if (draggedCard && draggedCard.classList.contains('approved')) {
                column.appendChild(draggedCard);
                console.log('Card appended to column:', e.currentTarget); // LOG
            }
        });
    });
});