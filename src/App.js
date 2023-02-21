import './App.css';
import Navbar from "./Components/Navbar";
import Contacts from "./Components/contact/Contacts";
import {useContext, useEffect, useState, useSyncExternalStore} from "react";
import {Routes, Route, Navigate, useNavigate} from "react-router-dom";
import {AddContact, Contact, EditContact, ViewContact} from './Components';
import {confirmAlert} from "react-confirm-alert";
import {createContact, deleteContact, getAllContacts, getAllGroups, updateContact} from "./services/ContactServices";
import {COMMENT, CURRENTLINE, FOREGROUND, PURPLE, YELLOW} from "./helpers/colors";
import {ContactContext} from './context/contactContext';

function App() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState([]);
    const [forceRender, setForceRender] = useState(false);
    const [contactQuery, setContactQuery] = useState({text: ""});
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [contact, setContact] = useState({});

    const navigate = useNavigate();
    const fetchData = async () => {
        try {
            setLoading(true);

            const {data: contactsData} = await getAllContacts();
            const {data: groupsData} = await getAllGroups();
            setContacts(contactsData);
            setFilteredContacts(contactsData);
            setGroups(groupsData);

            setLoading(false);
        } catch (err) {
            console.log(err.message);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const createContactForm = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const {status, data} = await createContact(contact);

            console.log(status);
            if (status === 201) {
                const allContacts = [...contacts, data];
                setContacts(allContacts);
                setFilteredContacts(allContacts);
                setContact({});
                setLoading(prevLoding => !prevLoding)
                navigate("/contacts");
            }
        } catch (err) {
            console.log(err.message);
        }
    };
    const onContactChange = (event) => {
        setContact({
            ...contact,
            [event.target.name]: event.target.value,
        });
    };
    const confirmDelete = (contactId, contactFullname) => {
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div
                        dir="rtl"
                        style={{
                            backgroundColor: CURRENTLINE,
                            border: `1px solid ${PURPLE}`,
                            borderRadius: "1em",
                        }}
                        className="p-4"
                    >
                        <h1 style={{color: YELLOW}}>پاک کردن مخاطب</h1>
                        <p style={{color: FOREGROUND}}>
                            مطمئنی که میخوای مخاطب {contactFullname} رو پاک کنی ؟
                        </p>
                        <button
                            onClick={() => {
                                removeContact(contactId);
                                onClose();
                            }}
                            className="btn mx-2"
                            style={{backgroundColor: PURPLE}}
                        >
                            مطمئن هستم
                        </button>
                        <button
                            onClick={onClose}
                            className="btn"
                            style={{backgroundColor: COMMENT}}
                        >
                            انصراف
                        </button>
                    </div>
                );
            },
        });
    };
    const removeContact = async (contactId) => {
        console.log('deleted')
            let prevContacts = [...contacts];
        try {
            setLoading(true);
            let allContact = [...contacts];
            let id = allContact.find(contact => contact.id === parseInt(contactId));
            let newContact = allContact.filter(contact => contact.id !== id.id)
            const response = deleteContact(contactId);
            setFilteredContacts(newContact)
            setContacts(newContact)
            if (response) {
                const {data: contactsData} = await getAllContacts();

                setContacts(contactsData);
                setLoading(false);
            }
        } catch (err) {
            setFilteredContacts(prevContacts)
            setContacts(prevContacts)
            console.log(err.message);
            setLoading(false);
        }

    }
    const updatedContact = async (event, contact, contactId) => {
        event.preventDefault();
            const contactsState = contacts;
        try {
            let allContact = [...contacts];
            let id = allContact.findIndex(contact => contact.id === parseInt(contactId));
            setLoading(true)
            allContact[id] = contact;

            setContacts(allContact);
            setFilteredContacts(allContact);
            const {data} = await updateContact(contact, contactId);

            if (data) {
                setLoading(false)
                setContact({});
                navigate("/contacts");
            }
        } catch (err) {
            console.log(err);
            setContacts(contactsState);
            setFilteredContacts(contactsState);
            setLoading(false);
        }
    }
    const contactSearch = (event) => {
        setContactQuery({...contactQuery, text: event.target.value});
        const allContacts = contacts.filter((contact) => {
            return contact.fullname
                .toLowerCase()
                .includes(event.target.value.toLowerCase());
        });

        setFilteredContacts(allContacts);
    };
    return (
        <ContactContext.Provider value={{
            loading,
            setLoading,
            contact,
            setContact,
            contactQuery,
            contacts,
            filteredContacts,
            groups,
            onContactChange,
            deleteContact: confirmDelete,
            createContact: createContactForm,
            contactSearch,
            updatedContact
        }}>
            <div className="App">
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Navigate to="/contacts"/>}/>
                    <Route path="/contacts" element={<Contacts/>}/>
                    <Route path="/contacts/add" element={<AddContact/>}
                    />
                    <Route path="/contact/:contactId" element={<ViewContact/>}/>
                    <Route path="/contacts/edit/:contactId"
                           element={<EditContact loading={loading} updateContact={updateContact}/>}/>
                </Routes>
            </div>
        </ContactContext.Provider>

    );
}

export default App;
