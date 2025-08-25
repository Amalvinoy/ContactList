// Submit handler to add a contact
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    if (!name || !phone) return;

    addContact(name, phone);
    e.target.reset();
});

const listEl = document.getElementById('contactList');

// Event delegation for edit/save/cancel/delete buttons
listEl.addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const li = btn.closest('li');
    if (!li) return;

    if (btn.classList.contains('delete')) {
        li.remove();
        return;
    }

    if (btn.classList.contains('edit')) {
        if (li.classList.contains('editing')) {
            // Save
            const nameInput = li.querySelector('.edit-name');
            const phoneInput = li.querySelector('.edit-phone');
            const newName = nameInput.value.trim();
            const newPhone = phoneInput.value.trim();
            if (!newName || !newPhone) return;
            li.querySelector('.contact-name').textContent = newName;
            li.querySelector('.contact-phone').textContent = newPhone;
            stopEditing(li);
        } else {
            startEditing(li);
        }
        return;
    }

    if (btn.classList.contains('cancel-edit')) {
        stopEditing(li, { restore: true });
        return;
    }
});

function addContact(name, phone) {
    const li = createContactElement(name, phone);
    listEl.appendChild(li);
}

function createContactElement(name, phone) {
    const li = document.createElement('li');

    const info = document.createElement('div');
    info.className = 'contact-info';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'contact-name';
    nameSpan.textContent = name;

    const sep = document.createElement('span');
    sep.className = 'contact-sep';
    sep.textContent = '•';

    const phoneSpan = document.createElement('span');
    phoneSpan.className = 'contact-phone';
    phoneSpan.textContent = phone;

    info.append(nameSpan, sep, phoneSpan);

    const actions = document.createElement('div');
    actions.className = 'contact-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn edit';
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.title = 'Edit contact';

    const delBtn = document.createElement('button');
    delBtn.className = 'btn danger delete';
    delBtn.type = 'button';
    delBtn.textContent = 'Delete';
    delBtn.title = 'Delete contact';

    actions.append(editBtn, delBtn);

    li.append(info, actions);
    return li;
}

function startEditing(li) {
    const nameText = li.querySelector('.contact-name').textContent;
    const phoneText = li.querySelector('.contact-phone').textContent;

    li.dataset.prevName = nameText;
    li.dataset.prevPhone = phoneText;

    const editWrap = document.createElement('div');
    editWrap.className = 'edit-fields';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'edit-name';
    nameInput.value = nameText;

    const phoneInput = document.createElement('input');
    phoneInput.type = 'text';
    phoneInput.className = 'edit-phone';
    phoneInput.value = phoneText;

    editWrap.append(nameInput, phoneInput);

    li.querySelector('.contact-info').style.display = 'none';
    li.insertBefore(editWrap, li.querySelector('.contact-actions'));

    const editBtn = li.querySelector('.edit');
    editBtn.textContent = 'Save';
    editBtn.title = 'Save changes';

    // Show Cancel, hide Delete while editing
    let cancelBtn = li.querySelector('.cancel-edit');
    if (!cancelBtn) {
        cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn light cancel-edit';
        cancelBtn.type = 'button';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.title = 'Cancel editing';
        li.querySelector('.contact-actions').appendChild(cancelBtn);
    }
    const deleteBtn = li.querySelector('.delete');
    if (deleteBtn) deleteBtn.style.display = 'none';

    li.classList.add('editing');
    nameInput.focus();
}

function stopEditing(li, options = {}) {
    const { restore = false } = options;
    const info = li.querySelector('.contact-info');

    if (restore) {
        if (li.dataset.prevName) info.querySelector('.contact-name').textContent = li.dataset.prevName;
        if (li.dataset.prevPhone) info.querySelector('.contact-phone').textContent = li.dataset.prevPhone;
    }

    const editWrap = li.querySelector('.edit-fields');
    if (editWrap) editWrap.remove();
    info.style.display = '';

    const editBtn = li.querySelector('.edit');
    if (editBtn) {
        editBtn.textContent = 'Edit';
        editBtn.title = 'Edit contact';
    }

    const cancelBtn = li.querySelector('.cancel-edit');
    if (cancelBtn) cancelBtn.remove();

    const deleteBtn = li.querySelector('.delete');
    if (deleteBtn) deleteBtn.style.display = '';

    li.classList.remove('editing');
    delete li.dataset.prevName;
    delete li.dataset.prevPhone;
}
