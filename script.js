document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    if (name && phone) {
        addContact(name, phone);
        document.getElementById('contactForm').reset();
    }
});

function addContact(name, phone) {
    const li = document.createElement('li');
    li.textContent = `${name} - ${phone}`;
    document.getElementById('contactList').appendChild(li);
}
