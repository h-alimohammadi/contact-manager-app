import {ContactContext} from "../../context/contactContext";
import {useContext, useRef} from "react";

const SearchContact = ({query,search}) => {
        let {contactQuery, contactSearch} = useContext(ContactContext);
        let inputRef = useRef(null);

    return (
        <div className="input-group mx-2 w-75" dir="ltr">
      <span
          className="input-group-text"
          id="basic-addon1"
          style={{backgroundColor: "purple"}}
      >
        <i className="fas fa-search"/>
      </span>
            <input
                ref={inputRef}
                dir="rtl"
                type="text"
                style={{backgroundColor: "gray", borderColor: "purple"}}
                className="form-control"
                placeholder="حستحوی مخاطب"
                aria-label="Search"
                aria-describedby="basic-addon1"
                value={contactQuery.text}
                onChange={contactSearch}
            />
        </div>
    );
};

export default SearchContact;
