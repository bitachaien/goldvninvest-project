import { FaAngleDown } from "react-icons/fa";
import { useState } from "react";

export const CustomAccordion = ({ faqIten }: any) => {
  const [faqDown, setFaqDown] = useState(true);
  const faqArrow = () => setFaqDown(!faqDown);

  return (
    <div className="accordion" id="accordionExample">
      <div>
        <div className="card">
          <div className="card-header" id="headingThree">
            <h5 className="mb-0 header-align">
              <button
                className="btn btn-link collapsed"
                type="button"
                onClick={faqArrow}
                data-toggle="collapse"
                data-target={`#collapseThree${faqIten?.id}`}
                aria-expanded="false"
                aria-controls={`collapseThree${faqIten?.id}`}
              >
                {faqIten?.question}
              </button>
              <div className=" tradex-mr-5">
                <FaAngleDown className={`${faqDown ? "faqDown" : ""}`} />
              </div>
            </h5>
          </div>
          <div
            id={`collapseThree${faqIten?.id}`}
            className="collapse"
            aria-labelledby="headingThree"
            data-parent="#accordionExample"
          >
            <div className="card-body">{faqIten?.answer}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
