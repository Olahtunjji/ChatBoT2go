 
        document.addEventListener('DOMContentLoaded', function() {
            const contactsContainer = document.getElementById('contacts-container');
            const contactForm = document.getElementById('contact-form');
            const contactModal = document.getElementById('contact-modal');
            const addContactBtn = document.getElementById('add-contact-btn');
            const cancelBtn = document.getElementById('cancel-btn');
            
            // API Base URL (replace with your actual backend URL)
            const API_URL = 'https://your-backend-api.com/contacts';
            
            // Fetch contacts from backend
            async function fetchContacts() {
                try {
                    const response = await fetch(API_URL);
                    const contacts = await response.json();
                    renderContacts(contacts);
                } catch (error) {
                    console.error('Error fetching contacts:', error);
                }
            }
            
            // Render contacts to the page
            function renderContacts(contacts) {
                contactsContainer.innerHTML = '';
                contacts.forEach(contact => {
                    const contactCard = document.createElement('div');
                    contactCard.className = 'bg-white rounded-lg shadow-md p-6 border border-gray-200';
                    contactCard.innerHTML = `
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                                ${contact.name.charAt(0)}
                            </div>
                            <div>
                                <h3 class="font-bold">${contact.name}</h3>
                                <p class="text-sm text-gray-600">${contact.company || 'No company'}</p>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <p class="flex items-center text-sm">
                                <i class="fas fa-envelope mr-2 text-gray-500"></i>
                                ${contact.email}
                            </p>
                            ${contact.phone ? `
                            <p class="flex items-center text-sm">
                                <i class="fas fa-phone mr-2 text-gray-500"></i>
                                ${contact.phone}
                            </p>` : ''}
                        </div>
                        <div class="mt-4 flex space-x-2">
                            <button onclick="editContact('${contact.id}')" class="text-indigo-600 hover:text-indigo-800">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteContact('${contact.id}')" class="text-red-600 hover:text-red-800">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    contactsContainer.appendChild(contactCard);
                });
            }
            
            // Add new contact
            addContactBtn.addEventListener('click', () => {
                document.getElementById('modal-title').textContent = 'Add New Contact';
                document.getElementById('contact-id').value = '';
                contactForm.reset();
                contactModal.classList.remove('hidden');
            });
            
            // Cancel button
            cancelBtn.addEventListener('click', () => {
                contactModal.classList.add('hidden');
            });
            
            // Form submission
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const contactData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    company: document.getElementById('company').value
                };
                
                const contactId = document.getElementById('contact-id').value;
                const method = contactId ? 'PUT' : 'POST';
                const url = contactId ? `${API_URL}/${contactId}` : API_URL;
                
                try {
                    const response = await fetch(url, {
                        method,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(contactData)
                    });
                    
                    if (response.ok) {
                        contactModal.classList.add('hidden');
                        fetchContacts();
                    }
                } catch (error) {
                    console.error('Error saving contact:', error);
                }
            });
            
            // Edit contact
            window.editContact = async (id) => {
                try {
                    const response = await fetch(`${API_URL}/${id}`);
                    const contact = await response.json();
                    
                    document.getElementById('modal-title').textContent = 'Edit Contact';
                    document.getElementById('contact-id').value = contact.id;
                    document.getElementById('name').value = contact.name;
                    document.getElementById('email').value = contact.email;
                    document.getElementById('phone').value = contact.phone || '';
                    document.getElementById('company').value = contact.company || '';
                    
                    contactModal.classList.remove('hidden');
                } catch (error) {
                    console.error('Error fetching contact:', error);
                }
            };
            
            // Delete contact
            window.deleteContact = async (id) => {
                if (confirm('Are you sure you want to delete this contact?')) {
                    try {
                        const response = await fetch(`${API_URL}/${id}`, {
                            method: 'DELETE'
                        });
                        
                        if (response.ok) {
                            fetchContacts();
                        }
                    } catch (error) {
                        console.error('Error deleting contact:', error);
                    }
                }
            };
            
            // Initial load
            fetchContacts();
        });
