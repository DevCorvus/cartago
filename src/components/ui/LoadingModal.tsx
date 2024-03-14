import Loading from './Loading';
import Modal from './Modal';

export default function LoadingModal() {
  return (
    <Modal>
      <div className="rounded-md bg-white p-8 shadow-md">
        <Loading />
      </div>
    </Modal>
  );
}
