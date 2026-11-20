import { useState } from "react";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      firstName: "Fateme",
      lastName: "Khandan",
      email: "fati@gmail.com",
      phone: "09366119616",
    },
    {
      id: 2,
      firstName: "Amir",
      lastName: "Rahimi",
      email: "amir@gmail.com",
      phone: "09120943422",
    },
    {
      id: 3,
      firstName: "Zahra",
      lastName: "Hoseini",
      email: "zahra@gmail.com",
      phone: "09184862177",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
const [selectedIds, setSelectedIds] = useState([]);
  const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const filteredContacts = contacts.filter((contact) => {
    const fullName =
      contact.firstName +
      " " +
      contact.lastName +
      " " +
      contact.email;

    return fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const handleAddContact = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    if (editingId !== null) {
      setContacts(
        contacts.map((contact) =>
          contact.id === editingId
            ? { ...formData, id: editingId }
            : contact
        )
      );
    } else {
      const newContact = {
        id: Date.now(),
        ...formData,
      };

      setContacts([...contacts, newContact]);
    }

    setFormData(emptyForm);
    setErrors({});
    setShowForm(false);
    setEditingId(null);
  };

  const handleEditContact = (contact) => {
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
    });

    setEditingId(contact.id);
    setShowForm(true);
    setErrors({});
  };

  const handleDeleteContact = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );

    if (confirmed) {
      setContacts(
        contacts.filter((contact) => contact.id !== id)
      );
    }
  };
const handleSelectContact = (id) => {
  if (selectedIds.includes(id)) {
    setSelectedIds(selectedIds.filter((item) => item !== id));
  } else {
    setSelectedIds([...selectedIds, id]);
  }
};

const handleDeleteSelected = () => {
  if (selectedIds.length === 0) return;

  const confirmed = window.confirm(
    "Are you sure you want to delete selected contacts?"
  );

  if (confirmed) {
    setContacts(
      contacts.filter((contact) => !selectedIds.includes(contact.id))
    );

    setSelectedIds([]);
  }
};
  const handleCancel = () => {
    setShowForm(false);
    setFormData(emptyForm);
    setErrors({});
    setEditingId(null);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div>
          <h1>My Contacts</h1>
          <p>Manage your contacts in one place</p>
        </div>

        <button
          className="add-button"
          onClick={() => {
            setFormData(emptyForm);
            setEditingId(null);
            setErrors({});
            setShowForm(true);
          }}
        >
          + Add Contact
        </button>
      </header>

      <main className="contacts-container">
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <span className="contact-count">
            {filteredContacts.length} Contacts
          </span>
          {selectedIds.length > 0 && (
  <button
    className="delete-button"
    onClick={handleDeleteSelected}
  >
    Delete Selected ({selectedIds.length})
  </button>
)}
        </div>

        {showForm && (
          <form className="contact-form" onSubmit={handleAddContact}>
            <h2>
              {editingId !== null ? "Edit Contact" : "Add New Contact"}
            </h2>

            <div className="form-fields">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && (
                  <small className="error-message">
                    {errors.firstName}
                  </small>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {errors.lastName && (
                  <small className="error-message">
                    {errors.lastName}
                  </small>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <small className="error-message">
                    {errors.email}
                  </small>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && (
                  <small className="error-message">
                    {errors.phone}
                  </small>
                )}
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="save-button">
                {editingId !== null ? "Update Contact" : "Save Contact"}
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="contacts-list">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div className="contact-row" key={contact.id}>
                <input
  type="checkbox"
  checked={selectedIds.includes(contact.id)}
  onChange={() => handleSelectContact(contact.id)}
/>
                <div className="contact-info">
                  <div className="avatar">
                    {contact.firstName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3>
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <p>{contact.email}</p>
                    <p>{contact.phone}</p>
                  </div>
                </div>

                <div className="actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEditContact(contact)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-message">No contacts found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;