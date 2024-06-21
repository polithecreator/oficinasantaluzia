let notes = [];
let totalValue = 0;

function addService() {
    const servicesContainer = document.getElementById('services-container');
    const serviceDiv = document.createElement('div');
    serviceDiv.className = 'service';
    serviceDiv.innerHTML = `
        <input type="text" placeholder="Serviço Realizado" required>
        <input type="number" placeholder="Valor do Serviço (R$)" required oninput="updateTotalValue()">
    `;
    servicesContainer.appendChild(serviceDiv);
}

function updateTotalValue() {
    const serviceValues = document.querySelectorAll('.service input[type="number"]');
    totalValue = Array.from(serviceValues).reduce((sum, input) => sum + Number(input.value), 0);
    document.getElementById('total-value').textContent = totalValue;
}

function createNote() {
    const customerName = document.getElementById('customer-name').value;
    const vehicleModel = document.getElementById('vehicle-model').value;
    const serviceElements = document.querySelectorAll('.service');
    const services = Array.from(serviceElements).map(serviceElement => ({
        description: serviceElement.children[0].value,
        value: Number(serviceElement.children[1].value)
    }));

    if (customerName && vehicleModel && services.every(service => service.description && service.value)) {
        const note = {
            customerName,
            vehicleModel,
            services,
            totalValue,
            status: 'pendente'
        };

        notes.push(note);
        notes.sort((a, b) => a.customerName.localeCompare(b.customerName));
        renderNotes();
        clearForm();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

function renderNotes(filteredNotes = notes) {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    filteredNotes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        const servicesDescription = note.services.map(service => `${service.description}: R$${service.value}`).join('<br>');
        noteElement.innerHTML = `
            <div class="details">
                <strong>${note.customerName}</strong>
                <span>Veículo: ${note.vehicleModel}</span>
                <span>Serviços:<br>${servicesDescription}</span>
                <span>Valor Total: R$${note.totalValue}</span>
            </div>
            <div class="status">
                <span>${note.status}</span>
                <button class="${note.status === 'pago' ? 'paid' : 'pending'}" onclick="toggleStatus(${index})">
                    ${note.status === 'pago' ? 'Pago' : 'Marcar como Pago'}
                </button>
                ${note.status === 'pago' ? `<button class="print" onclick="printReceipt(${index})">Imprimir Recibo</button>` : ''}
            </div>
        `;

        notesList.appendChild(noteElement);
    });
}

function toggleStatus(index) {
    notes[index].status = notes[index].status === 'pago' ? 'pendente' : 'pago';
    renderNotes();
}

function clearForm() {
    document.getElementById('customer-name').value = '';
    document.getElementById('vehicle-model').value = '';
    document.getElementById('services-container').innerHTML = `
        <div class="service">
            <input type="text" placeholder="Serviço Realizado" required>
            <input type="number" placeholder="Valor do Serviço (R$)" required oninput="updateTotalValue()">
        </div>
    `;
    document.getElementById('total-value').textContent = '0';
    totalValue = 0;
}

function filterNotes() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filteredNotes = notes.filter(note => note.customerName.toLowerCase().includes(searchTerm));
    renderNotes(filteredNotes);
}

function printReceipt(index) {
    const note = notes[index];
    const receiptWindow = window.open('', '_blank');
    const servicesDescription = note.services.map(service => `<tr><td>${service.description}</td><td>R$${service.value}</td></tr>`).join('');
    receiptWindow.document.write(`
        <html>
        <head>
            <title>Recibo</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 10px; border: 1px solid #ccc; }
                th { background-color: #f4f4f4; }
            </style>
        </head>
        <body>
            <h1>Recibo de Pagamento</h1>
            <p><strong>Cliente:</strong> ${note.customerName}</p>
            <p><strong>Veículo:</strong> ${note.vehicleModel}</p>
            <table>
                <thead>
                    <tr>
                        <th>Serviço</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    ${servicesDescription}
                </tbody>
                <tfoot>
                    <tr>
                        <th>Total</th>
                        <th>R$${note.totalValue}</th>
                    </tr>
                </tfoot>
            </table>
            <button onclick="window.print()">Imprimir</button>
        </body>
        </html>
    `);
    receiptWindow.document.close();
}
