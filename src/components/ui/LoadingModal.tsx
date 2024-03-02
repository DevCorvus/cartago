import Loading from './Loading';
import Modal from './Modal';

export default function LoadingModal() {
  return (
    <Modal>
      <div className="bg-white p-8 shadow-md rounded-md">
        <Loading />
      </div>
    </Modal>
  );
}
