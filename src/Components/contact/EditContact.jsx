import {useContext, useEffect, useState} from "react";

import {Link, useParams} from "react-router-dom";

import {
    getContact,
} from "../../services/ContactServices";
import {Spinner} from "../";
import {COMMENT, ORANGE, PURPLE} from "../../helpers/colors";
import {ContactContext} from "../../context/contactContext";

const EditContact = () => {
    const {contactId} = useParams();
    const {loading, setLoading,onContactChange, updatedContact,groups,contact,setContact} = useContext(ContactContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const {data: contactData} = await getContact(contactId);
                setContact(contactData);
                setLoading(false)
            } catch (err) {
                console.log(err);
                setLoading(false)
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {loading ? (
                <Spinner/>
            ) : (
                <>
                    <section className="p-3">
                        <div className="container">
                            <div className="row my-2">
                                <div className="col text-center">
                                    <p className="h4 fw-bold" style={{color: ORANGE}}>
                                        ویرایش مخاطب
                                    </p>
                                </div>
                            </div>
                            <hr style={{backgroundColor: ORANGE}}/>
                            <div
                                className="row p-2 w-75 mx-auto align-items-center"
                                style={{backgroundColor: "#44475a", borderRadius: "1em"}}
                            >
                                <div className="col-md-8">
                                    <form onSubmit={(event) => {
                                        updatedContact(event, contact, contactId)
                                    }}>
                                        <div className="mb-2">
                                            <input
                                                name="fullname"
                                                type="text"
                                                className="form-control"
                                                value={contact.fullname}
                                                onChange={onContactChange}
                                                required={true}
                                                placeholder="نام و نام خانوادگی"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <input
                                                name="photo"
                                                type="text"
                                                value={contact.photo}
                                                onChange={onContactChange}
                                                className="form-control"
                                                required={true}
                                                placeholder="آدرس تصویر"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <input
                                                name="mobile"
                                                type="number"
                                                className="form-control"
                                                value={contact.mobile}
                                                onChange={onContactChange}
                                                required={true}
                                                placeholder="شماره موبایل"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <input
                                                name="email"
                                                type="email"
                                                className="form-control"
                                                value={contact.email}
                                                onChange={onContactChange}
                                                required={true}
                                                placeholder="آدرس ایمیل"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <input
                                                name="job"
                                                type="text"
                                                className="form-control"
                                                value={contact.job}
                                                onChange={onContactChange}
                                                required={true}
                                                placeholder="شغل"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <select
                                                name="group"
                                                value={contact.group}
                                                onChange={onContactChange}
                                                required={true}
                                                className="form-control"
                                                multiple={false}
                                            >
                                                <option value="">انتخاب گروه</option>
                                                {groups.length > 0 &&
                                                    groups.map((group) => (
                                                        <option key={group.id} value={group.id}>
                                                            {group.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <input
                                                type="submit"
                                                className="btn"
                                                style={{backgroundColor: PURPLE}}
                                                value="ویرایش مخاطب"
                                                onClick={event => updatedContact(event, contact , contactId)}
                                            />
                                            <Link
                                                to={"/contacts"}
                                                className="btn mx-2"
                                                style={{backgroundColor: COMMENT}}
                                            >
                                                انصراف
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-4">
                                    <img
                                        src={contact.photo}
                                        className="img-fluid rounded"
                                        style={{border: `1px solid ${PURPLE}`}}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-1">
                            <img
                                src={require("../../assets/man-taking-note.png")}
                                height="300px"
                                style={{opacity: "60%"}}
                            />
                        </div>
                    </section>
                </>
            )}
        </>
    );
};

export default EditContact;
