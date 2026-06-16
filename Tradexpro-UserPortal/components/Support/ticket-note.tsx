import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import {
  supportTicketNoteCreate,
  supportTicketNoteDelete,
} from "service/knowledgebase";

export const TicketNote = ({ ticketDetails, notes, setNotes }: any) => {
  const [note, setNote] = useState("");
  const { t } = useTranslation("common");

  const saveNote = async () => {
    if (!note) {
      toast.error("Note cannot be empty");
      return;
    }
    const { data } = await supportTicketNoteCreate(ticketDetails?.id, note);
    setNotes(data);
    setNote("");
  };
  const deleteNote = async (unique_code: any) => {
    const { data } = await supportTicketNoteDelete(unique_code);
    setNotes(data);
  };
  return (
    <div className=" tradex-space-y-3">
      <h5 className="tradex-text-xl !tradex-text-title">{t("Note")}</h5>
      <div className=" tradex-flex tradex-gap-2 tradex-items-center">
        <input
          className="tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-10 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent"
          type="text"
          name="notes"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
          }}
        />
        <button
          className="tradex-px-2.5 tradex-py-1.5 tradex-min-h-10 tradex-bg-primary tradex-text-white tradex-text-base tradex-font-semibold tradex-rounded tradex-flex tradex-items-center tradex-justify-center"
          type="button"
          onClick={saveNote}
        >
          {t("Save")}
        </button>
      </div>

      <div className=" tradex-space-y-2">
        {notes?.map((note: any, index: any) => (
          <div
            key={index}
            className="tradex-px-2.5 tradex-py-1.5 tradex-rounded tradex-border tradex-border-background-primary tradex-flex  tradex-gap-3 tradex-justify-between tradex-items-center"
          >
            <p className=" tradex-text-sm tradex-leading-[22px] tradex-text-body">
              {note?.notes}
            </p>
            <span
              className=" tradex-cursor-pointer"
              onClick={() => {
                deleteNote(note?.unique_code);
              }}
            >
              <MdDelete className=" tradex-text-base tradex-text-red-500" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
