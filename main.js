document.addEventListener('DOMContentLoaded', () => {
    const kanbanCards = document.querySelectorAll('.kanban-card');
    const kanbanColumns = document.querySelectorAll('.kanban-cards');
    const createTaskBtn = document.getElementById('create-task-btn');
    const taskTitleInput = document.getElementById('task-title');
    const taskPrioritySelect = document.getElementById('task-priority');
    const pendingColumn = document.querySelector('.kanban-cards[data-column-id="1"]');
    const managerPassword = "gerente"; // Substitua pela senha real do gerente
    let draggedCard = null;

    // Função para criar um novo card HTML
    function createNewCard(title, priority) {
        const card = document.createElement('div');
        card.classList.add('kanban-card');
        card.setAttribute('draggable', false); // Inicialmente não arrastável

        const badge = document.createElement('div');
        badge.classList.add('badge', priority);
        badge.innerHTML = `<span>${priority === 'high' ? 'Alta prioridade' : (priority === 'medium' ? 'Média prioridade' : 'Baixa prioridade')}</span>`;

        const cardTitle = document.createElement('p');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = title;

        const cardInfos = document.createElement('div');
        cardInfos.classList.add('card-infos');
        cardInfos.innerHTML = `
            <div class="card-icons">
                <p><i class="fa-regular fa-comment"></i> 0</p>
                <p><i class="fa-solid fa-paperclip"></i> 0</p>
            </div>
            <div class="user">
                <img src="./img/smile-2072907_640.jpg" alt="User">
            </div>
        `;

        // Adicionando o botão de exclusão
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-card-btn');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

        // Adicionando o botão de aprovar
        const approveButton = document.createElement('button');
        approveButton.classList.add('approve-card-btn');
        approveButton.textContent = 'Aprovar';

        card.appendChild(badge);
        card.appendChild(cardTitle);
        card.appendChild(cardInfos);
        card.appendChild(deleteButton);
        card.appendChild(approveButton);

        // Event listener para o botão de aprovar
        approveButton.addEventListener('click', (e) => {
            const enteredPassword = prompt("Digite a senha do gerente para aprovar esta tarefa:");
            if (enteredPassword === managerPassword) {
                card.classList.add('approved');
                card.setAttribute('draggable', true); // Tornar arrastável após aprovação
                approveButton.remove(); // Remover o botão de aprovar após clicar
                e.stopPropagation();
            } else if (enteredPassword !== null) {
                alert("Senha incorreta. A tarefa não foi aprovada.");
            }
        });

        // Adiciona os event listeners de drag ao novo card (será ativado após aprovação)
        card.addEventListener('dragstart', (e) => {
            if (card.classList.contains('approved')) {
                draggedCard = e.target;
                e.target.classList.add('dragging');
            } else {
                e.preventDefault(); // Impede o drag se não estiver aprovado
            }
        });

        card.addEventListener('dragend', () => {
            if (draggedCard) {
                draggedCard.classList.remove('dragging');
                draggedCard = null;
            }
        });

        // Adiciona o event listener para o botão de exclusão
        deleteButton.addEventListener('click', (e) => {
            const cardToDelete = e.target.closest('.kanban-card');
            if (cardToDelete) {
                cardToDelete.remove();
            }
            e.stopPropagation();
        });

        return card;
    }

    // Adiciona o botão de aprovar e exclusão aos cards existentes na coluna pendente
    pendingColumn.querySelectorAll('.kanban-card').forEach(card => {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-card-btn');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        card.appendChild(deleteButton);

        const approveButton = document.createElement('button');
        approveButton.classList.add('approve-card-btn');
        approveButton.textContent = 'Aprovar';
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

        deleteButton.addEventListener('click', (e) => {
            const cardToDelete = e.target.closest('.kanban-card');
            if (cardToDelete) {
                cardToDelete.remove();
            }
            e.stopPropagation();
        });

        // Inicialmente, cards existentes na pendente não são arrastáveis até serem aprovados
        card.setAttribute('draggable', false);
        card.addEventListener('dragstart', (e) => {
            if (card.classList.contains('approved')) {
                draggedCard = e.target;
                e.target.classList.add('dragging');
            } else {
                e.preventDefault();
            }
        });
        card.addEventListener('dragend', () => {
            if (draggedCard) {
                draggedCard.classList.remove('dragging');
                draggedCard = null;
            }
        });
    });

    // Event listener para o botão de criar tarefa
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', () => {
            const title = taskTitleInput.value.trim();
            const priority = taskPrioritySelect.value;

            if (title) {
                const newCard = createNewCard(title, priority);
                pendingColumn.appendChild(newCard);

                // Limpa o formulário após a criação
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
            }
        });

        column.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('cards-hover');
        });

        column.addEventListener('drop', (e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('cards-hover');
            if (draggedCard && draggedCard.classList.contains('approved')) {
                column.appendChild(draggedCard);
            }
        });
    });
});