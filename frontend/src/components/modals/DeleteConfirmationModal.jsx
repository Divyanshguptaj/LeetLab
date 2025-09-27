import React from "react";

const DeleteConfirmationModal = ({ isOpen, playlist, onCancel, onConfirm }) => {
  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
        <p className="py-4">
          Are you sure you want to delete the playlist{" "}
          <span className="font-semibold text-error">
            {playlist?.name}
          </span>
          ? <br />
          This action cannot be undone and will remove all problems from this
          playlist.
        </p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onCancel}>close</button>
      </form>
    </dialog>
  );
};

export default DeleteConfirmationModal;
