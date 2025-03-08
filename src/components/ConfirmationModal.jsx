import PropTypes from 'prop-types';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-70"
        onClick={onCancel}
      ></div>
      <div className="bg-gray-800 text-white p-8 rounded shadow-lg z-10 transform transition duration-300 ease-in-out">
        <p className="mb-4 text-center">{message}</p>
        <div className="flex justify-around">
          <button
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationModal;
